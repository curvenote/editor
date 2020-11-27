/* eslint-disable max-classes-per-file */
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

class LinkView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement;

  node: Node;

  view: EditorView;

  constructor(node: Node, view: EditorView, getPos: (() => number) | undefined) {
    this.node = node;
    this.view = view;
    this.dom = document.createElement<'a'>('a');
    const { href, title } = node.attrs;
    this.dom.setAttribute('href', href);
    this.dom.setAttribute('title', title || href);
    this.dom.setAttribute('target', '_blank');
    this.dom.setAttribute('rel', 'noopener noreferrer');
  }
}

export default LinkView;
