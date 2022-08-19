import type { Node } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import type { GetPos } from './types';

class NewTopBlockNodeView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLDivElement;
  contentDOM: HTMLDivElement;

  node: Node;

  view: EditorView;

  getPos?: GetPos;

  constructor(node: Node, view: EditorView, getPos: GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');

    const blockControls = document.createElement('div');
    blockControls.setAttribute('contenteditable', 'false');
    blockControls.innerText = 'block controls';
    blockControls.classList.add('block-controls');
    this.dom.appendChild(blockControls);

    const contentContainer = document.createElement('div');
    this.dom.appendChild(contentContainer);

    this.dom.classList.add('yoo');
    this.contentDOM = contentContainer; // tells prosemirror to render children here
  }

  selectNode() {
    if (!isEditable(this.view.state)) return;
    this.dom.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
  }
}

export function createTopBlockView(node: Node, view: EditorView, getPos: GetPos) {
  return new NewTopBlockNodeView(node, view, getPos);
}
