import { Node } from 'prosemirror-model';
import { Nodes } from '@curvenote/schema';
import { EditorView, NodeView } from 'prosemirror-view';
import { GetPos } from './types';

class HeadingView implements NodeView {
  node: Node;

  view: EditorView;

  getPos?: GetPos;

  contentDOM?: HTMLHeadingElement;

  constructor(node: Node, view: EditorView, getPos?: GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    const { id, level } = node.attrs as Nodes.Heading.Attrs;
    this.contentDOM = document.createElement(`h${level}`) as HTMLHeadingElement;
    if (id) this.contentDOM.setAttribute('data-id', id);
  }
}

export default HeadingView;
