import React from 'react';
import ReactDOM from 'react-dom';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Card, IconButton } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import { opts } from '../../connect';

class SelectionControl {
  dom: HTMLDivElement;

  constructor(view: EditorView, stateKey: string) {
    this.dom = document.createElement('div');
    this.dom.className = 'selection-control';
    ReactDOM.render(
      <Card style={{ borderRadius: '50%' }}>
        <IconButton
          color="primary"
          aria-label="add comment"
          onClick={() => {
            opts.addComment(stateKey, view);
          }}
        >
          <CommentIcon />
        </IconButton>
      </Card>,
      this.dom,
    );
    view.dom.parentNode?.appendChild(this.dom);
    this.update(view, null);
  }

  update(view: EditorView, lastState: EditorState | null) {
    const { state } = view;
    if (lastState && lastState.selection.eq?.(state.selection)) return;

    // Hide the tooltip if the selection is empty
    if (state.selection.empty) {
      this.dom.style.display = 'none';
      return;
    }

    // Otherwise, reposition it and update its content
    this.dom.style.display = '';
    const { from, to } = state.selection;
    // These are in screen coordinates
    const start = view.coordsAtPos(from);
    // The box in which the tooltip is positioned, to use as base
    if (!this.dom.offsetParent) {
      return;
    }
    const box = this.dom.offsetParent.getBoundingClientRect();
    // Find a center-ish x position from the selection endpoints (when
    // crossing lines, end may be more to the left)
    this.dom.style.bottom = `${box.bottom - start.top - 30}px`;
  }

  destroy() {
    this.dom.remove();
  }
}

export function createSelectPlugin(stateKey: string) {
  return new Plugin({
    view(editorView) {
      return new SelectionControl(editorView, stateKey);
    },
  });
}
