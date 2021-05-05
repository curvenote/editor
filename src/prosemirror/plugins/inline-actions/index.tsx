import React from 'react';
import { render } from 'react-dom';
import { Plugin, NodeSelection } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { findParentNode, isNodeSelection } from 'prosemirror-utils';
import { schemas } from '@curvenote/schema';
import Wrapper from './Wrapper';
import { isEditable } from '../editable';
import { getLinkBoundsIfTheyExist } from '../../../store/actions/utils';
import { SelectionKinds } from './types';


class InlineActions {
  view: EditorView;

  dom: HTMLDivElement;

  wrapper: null | Wrapper = null;

  constructor(view: EditorView) {
    this.view = view;
    this.dom = document.createElement('div');
    view.dom.parentNode?.appendChild(this.dom);
    render(
      <Wrapper view={view} ref={(r) => { this.wrapper = r; }} />,
      this.dom,
    );
    this.update(view);
  }

  update(view: EditorView) {
    const { state } = view;
    // Don't do anything if the document/selection didn't change
    // Add to the inputs: , lastState?: EditorState
    // if (
    //   lastState
    //   && lastState.doc.eq(state.doc)
    //   && lastState.selection.eq(state.selection)
    // ) return;

    const edit = isEditable(state);

    const linkBounds = getLinkBoundsIfTheyExist(state);
    if (linkBounds) {
      const anchorEl = view.nodeDOM(linkBounds.from)?.parentElement;
      this.wrapper?.setState({
        open: true, edit, kind: SelectionKinds.link, placement: 'bottom-start', anchorEl,
      });
      return;
    }

    const { node } = isNodeSelection(state.selection)
      ? (state.selection as NodeSelection) : { node: null };

    switch (node?.type.name as schemas.nodeNames | undefined) {
      case schemas.nodeNames.image: {
        const wrapper = view.nodeDOM(state.selection.from) as HTMLDivElement | undefined;
        const anchorEl = wrapper?.getElementsByTagName?.('img')[0] ?? wrapper;
        this.wrapper?.setState({
          open: true, edit, kind: SelectionKinds.image, placement: 'bottom', anchorEl,
        });
        return;
      }
      case schemas.nodeNames.iframe: {
        const wrapper = view.nodeDOM(state.selection.from) as HTMLDivElement | undefined;
        const anchorEl = wrapper?.getElementsByTagName?.('iframe')[0] ?? wrapper;
        this.wrapper?.setState({
          open: true, edit, kind: SelectionKinds.iframe, placement: 'bottom', anchorEl,
        });
        return;
      }
      case schemas.nodeNames.math: {
        const anchorEl = view.nodeDOM(state.selection.from);
        this.wrapper?.setState({
          open: true, edit, kind: SelectionKinds.math, placement: 'bottom-start', anchorEl,
        });
        return;
      }
      case schemas.nodeNames.equation: {
        const anchorEl = view.nodeDOM(state.selection.from);
        this.wrapper?.setState({
          open: true, edit, kind: SelectionKinds.equation, placement: 'bottom', anchorEl,
        });
        return;
      }
      case schemas.nodeNames.cite: {
        const anchorEl = view.nodeDOM(state.selection.from);
        this.wrapper?.setState({
          open: true, edit, kind: SelectionKinds.cite, placement: 'bottom-start', anchorEl,
        });
        return;
      }
      default:
        break;
    }

    const parent = findParentNode(
      (n: Node) => n.type.name === schemas.nodeNames.callout,
    )(state.selection);
    if (parent || node?.type.name === schemas.nodeNames.callout) {
      const anchorEl = view.nodeDOM(parent?.pos ?? state.selection.from);
      this.wrapper?.setState({
        open: true, edit, kind: SelectionKinds.callout, placement: 'bottom', anchorEl,
      });
      return;
    }

    // Hide the wrapper if nothing to show!
    this.wrapper?.setState({ open: false, edit });
  }

  destroy() { this.dom.remove(); }
}

const inlineActionsPlugin = new Plugin({
  view(editorView) { return new InlineActions(editorView); },
});

export default inlineActionsPlugin;
