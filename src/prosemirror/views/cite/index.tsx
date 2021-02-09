/* eslint-disable max-classes-per-file */
import React from 'react';
import { render } from 'react-dom';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import CiteEditor from './CiteEditor';
import { isEditable } from '../../plugins/editable';

class CiteView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement;

  node: Node;

  view: EditorView;

  editor: null | CiteEditor = null;

  getPos: (() => number);

  constructor(node: Node, view: EditorView, getPos: (() => number)) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('span');
    this.dom.classList.add('citation');
    const viewId = this.view.dom.id;

    const { key } = node.attrs;

    const onDelete = () => {
      const tr = this.view.state.tr.delete(this.getPos(), this.getPos() + 1);
      this.view.dispatch(tr);
    };

    render(
      <CiteEditor {...{ onDelete }} ref={(r) => { this.editor = r; }} />,
      this.dom,
      async () => {
        this.editor?.setState({
          viewId, uid: key,
        });
      },
    );
  }

  selectNode() {
    const viewId = this.view.dom.id;
    const edit = isEditable(this.view.state);
    this.editor?.setState({ open: this.view.hasFocus(), edit, viewId });
  }

  deselectNode() {
    const edit = isEditable(this.view.state);
    this.editor?.setState({ open: false, edit });
  }

  update(node: Node) {
    if (!node.sameMarkup(this.node)) return false;
    this.node = node;
    const edit = isEditable(this.view.state);
    const { key } = node.attrs;
    this.editor?.setState({ edit, uid: key });
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  destroy() {
    // TODO: Delete the actual image that was uploaded?
  }
}

export default CiteView;
