import React from 'react';
import { render } from 'react-dom';
import { Plugin, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import schema from '../../schema';
import PreviewEditor from './PreviewEditor';
import { isEditable } from '../editable';
import { getNodeIfSelected } from '../../../store/actions/utils';

class PreviewTooltip {
  view: EditorView;

  dom: HTMLDivElement;

  tooltip: null | PreviewEditor = null;

  constructor(view: EditorView) {
    this.view = view;
    this.dom = document.createElement('div');
    this.dom.style.position = 'absolute';
    this.dom.style.zIndex = '2';
    view.dom.parentNode?.appendChild(this.dom);
    render(
      <PreviewEditor ref={(r) => { this.tooltip = r; }} />,
      this.dom,
    );
    this.update(view, null);
  }

  update(view: EditorView, lastState: EditorState | null) {
    const { state } = view;
    // Don't do anything if the document/selection didn't change
    if (lastState && lastState.doc.eq(state.doc) && lastState.selection.eq(state.selection)) return;
    const node = getNodeIfSelected(state, schema.nodes.cite);

    // Hide the tooltip if the selection is empty
    if (!node) {
      this.tooltip?.setState({ open: false });
      return;
    }
    const { from, to } = state.selection;
    // Otherwise, reposition it and update its content
    // These are in screen coordinates
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);
    const box = this.dom.offsetParent?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const top = Math.max(start.bottom, end.bottom);
    const left = Math.min(start.left, end.left);
    this.dom.style.top = `${top - box.top + 10}px`;
    this.dom.style.left = `${left - box.left}px`;


    const viewId = view.dom.id;
    this.tooltip?.setState({
      viewId,
      open: true,
      edit: isEditable(state),
      uid: node.attrs.key,
    });
  }

  destroy() { this.dom.remove(); }
}

const previewPlugin = new Plugin({
  view(editorView) { return new PreviewTooltip(editorView); },
});

export default previewPlugin;
