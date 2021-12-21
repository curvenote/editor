import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { Nodes } from '@curvenote/schema';
import { GetPos } from './types';

class MentionNodeView {
  node: Node;

  view: EditorView;

  getPos: boolean | GetPos;

  dom: HTMLSpanElement;

  constructor(node: Node, view: EditorView, getPos: boolean | GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('span');
    this.dom.classList.add('mention');
    this.setData();
  }

  update(node: Node) {
    this.node = node;
    this.setData();
    return true;
  }

  setData() {
    const { label } = this.node.attrs as Nodes.Mention.Attrs;
    this.dom.innerText = label;
  }
}

export function MentionView(node: Node, view: EditorView, getPos: GetPos) {
  return new MentionNodeView(node, view, getPos);
}
