import React from 'react';
import { render } from 'react-dom';
import { Plugin, EditorState, NodeSelection } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { findParentNode, isNodeSelection } from 'prosemirror-utils';
import schema from '../../schema';
import Wrapper from './Wrapper';
import { isEditable } from '../editable';
import { getLinkBoundsIfTheyExist } from '../../../store/actions/utils';
import { SelectionKinds } from './types';


class InlineActions {
  view: EditorView;

  dom: HTMLDivElement;

  tooltip: null | Wrapper = null;

  constructor(view: EditorView) {
    this.view = view;
    this.dom = document.createElement('div');
    this.dom.style.position = 'absolute';
    this.dom.style.zIndex = '2';
    view.dom.parentNode?.appendChild(this.dom);
    render(
      <Wrapper view={view} ref={(r) => { this.tooltip = r; }} />,
      this.dom,
    );
    this.update(view, null);
  }

  update(view: EditorView, lastState: EditorState | null) {
    const { state } = view;
    // Don't do anything if the document/selection didn't change
    if (lastState && lastState.doc.eq(state.doc) && lastState.selection.eq(state.selection)) return;

    const edit = isEditable(state);

    const linkBounds = getLinkBoundsIfTheyExist(state);
    if (linkBounds) {
      const anchorEl = view.nodeDOM(linkBounds.from)?.parentElement;
      this.tooltip?.setState({
        open: true, edit, kind: SelectionKinds.link, placement: 'bottom-start', anchorEl,
      });
      return;
    }

    const { node } = isNodeSelection(state.selection)
      ? (state.selection as NodeSelection) : { node: null };

    switch (node?.type.name) {
      case schema.nodes.image.name: {
        const anchorEl = view.nodeDOM(state.selection.from)?.firstChild;
        this.tooltip?.setState({
          open: true, edit, kind: SelectionKinds.image, placement: 'bottom', anchorEl,
        });
        return;
      }
      case schema.nodes.iframe.name: {
        const anchorEl = view.nodeDOM(state.selection.from)?.firstChild;
        this.tooltip?.setState({
          open: true, edit, kind: SelectionKinds.iframe, placement: 'bottom', anchorEl,
        });
        return;
      }
      case schema.nodes.math.name: {
        const anchorEl = view.nodeDOM(state.selection.from);
        this.tooltip?.setState({
          open: true, edit, kind: SelectionKinds.math, placement: 'bottom-start', anchorEl,
        });
        return;
      }
      case schema.nodes.equation.name: {
        const anchorEl = view.nodeDOM(state.selection.from);
        this.tooltip?.setState({
          open: true, edit, kind: SelectionKinds.equation, placement: 'bottom', anchorEl,
        });
        return;
      }
      case schema.nodes.cite.name: {
        const anchorEl = view.nodeDOM(state.selection.from);
        this.tooltip?.setState({
          open: true, edit, kind: SelectionKinds.cite, placement: 'bottom-start', anchorEl,
        });
        return;
      }
      default:
        break;
    }

    const parent = findParentNode((n: Node) => n.type === schema.nodes.callout)(state.selection);
    if (parent || node?.type === schema.nodes.callout) {
      const anchorEl = view.nodeDOM(parent?.pos ?? state.selection.from);
      this.tooltip?.setState({
        open: true, edit, kind: SelectionKinds.callout, placement: 'bottom', anchorEl,
      });
      return;
    }

    // Hide the tooltip if nothing to show!
    this.tooltip?.setState({ open: false, edit });
  }

  destroy() { this.dom.remove(); }
}

const inlineActionsPlugin = new Plugin({
  view(editorView) { return new InlineActions(editorView); },
});

export default inlineActionsPlugin;
