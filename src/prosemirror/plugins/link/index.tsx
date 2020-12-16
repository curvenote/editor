import React from 'react';
import { render } from 'react-dom';
import { Plugin, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import schema from '../../schema';
import LinkEditor from './LinkEditor';
import { isEditable } from '../editable';
import { getLinkBoundsIfTheyExist } from '../../utils';

class LinkViewTooltip {
  view: EditorView;

  dom: HTMLDivElement;

  tooltip: null | LinkEditor = null;

  constructor(view: EditorView) {
    this.view = view;
    this.dom = document.createElement('div');
    this.dom.style.position = 'absolute';
    this.dom.style.zIndex = '2';
    view.dom.parentNode?.appendChild(this.dom);
    render(
      <LinkEditor ref={(r) => { this.tooltip = r; }} />,
      this.dom,
    );
    this.update(view, null);
  }

  update(view: EditorView, lastState: EditorState | null) {
    const { state } = view;
    // Don't do anything if the document/selection didn't change
    if (lastState && lastState.doc.eq(state.doc) && lastState.selection.eq(state.selection)) return;
    const linkBounds = getLinkBoundsIfTheyExist(state);

    // Hide the tooltip if the selection is empty
    if (!linkBounds) {
      this.tooltip?.setState({ open: false });
      return;
    }

    // Otherwise, reposition it and update its content
    // These are in screen coordinates
    const start = view.coordsAtPos(linkBounds.from);
    const end = view.coordsAtPos(linkBounds.to);
    const box = this.dom.offsetParent?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const top = Math.max(start.bottom, end.bottom);
    const left = Math.min(start.left, end.left);
    this.dom.style.top = `${top - box.top + 10}px`;
    this.dom.style.left = `${left - box.left}px`;

    const viewId = view.dom.id;
    const { href } = linkBounds.link.attrs;
    const mark = schema.marks.link;
    const onDelete = () => (
      this.view.dispatch(state.tr.removeMark(linkBounds.from, linkBounds.to, mark))
    );
    const onEdit = () => {
      // eslint-disable-next-line no-alert
      const newHref = prompt('What is the new link?', href);
      if (!newHref) return;
      const link = schema.marks.link.create({ href: newHref });
      const tr = state.tr
        .removeMark(linkBounds.from, linkBounds.to, mark)
        .addMark(linkBounds.from, linkBounds.to, link);
      this.view.dispatch(tr);
    };
    this.tooltip?.setState({
      viewId, open: true, edit: isEditable(state), href, onEdit, onDelete,
    });
  }

  destroy() { this.dom.remove(); }
}

const linkViewPlugin = new Plugin({
  view(editorView) { return new LinkViewTooltip(editorView); },
});

export default linkViewPlugin;
