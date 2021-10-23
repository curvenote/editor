import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import { GetPos } from './types';
import { clickSelectFigure } from './utils';

class ImageView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLImageElement;

  node: Node;

  view: EditorView;

  getPos?: GetPos;

  constructor(node: Node, view: EditorView, getPos: GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    const { src, title, alt, width } = node.attrs;
    this.dom = document.createElement('img');
    this.dom.addEventListener('mousedown', () => clickSelectFigure(view, getPos));
    this.dom.addEventListener('click', () => clickSelectFigure(view, getPos));
    this.dom.src = src;
    this.dom.alt = alt ?? '';
    this.dom.title = title ?? '';
    this.dom.style.width = `${width}%`;
  }

  selectNode() {
    if (!isEditable(this.view.state)) return;
    this.dom.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
  }
}

export default ImageView;
