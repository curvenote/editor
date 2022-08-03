import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { GetPos } from './types';

class LinkNodeView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement;

  node: Node;

  view: EditorView;

  getPos?: GetPos;

  constructor(node: Node, view: EditorView, getPos?: GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement<'a'>('a');
    const { href, title } = node.attrs;
    this.dom.setAttribute('href', href);
    this.dom.setAttribute('title', title || href);
    this.dom.setAttribute('target', '_blank');
    this.dom.setAttribute('rel', 'noopener noreferrer');
  }
}

export function LinkView(node: Node, view: EditorView, getPos: GetPos) {
  return new LinkNodeView(node, view, getPos);
}
