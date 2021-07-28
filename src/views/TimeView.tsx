import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { formatDatetime } from '@curvenote/schema/dist/nodes/time';

class TimeView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement;

  node: Node;

  view: EditorView;

  getPos?: () => number;

  constructor(node: Node, view: EditorView, getPos: (() => number) | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement<'time'>('time');
    this.setDate();
  }

  update(node: Node) {
    this.node = node;
    this.setDate();
    return true;
  }

  setDate() {
    const { datetime } = this.node.attrs;
    this.dom.setAttribute('datetime', datetime);
    const { f } = formatDatetime(datetime);
    this.dom.textContent = f;
  }
}

export default TimeView;
