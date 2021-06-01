/* eslint-disable max-classes-per-file */
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

class CiteView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement;

  node: Node;

  view: EditorView;

  getPos?: () => number;

  constructor(node: Node, view: EditorView, getPos: (() => number) | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement<'cite'>('cite');
    const { title, inline } = node.attrs;
    this.dom.setAttribute('title', title);
    this.dom.textContent = inline;
  }
}

export default CiteView;
