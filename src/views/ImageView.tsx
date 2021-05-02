/* eslint-disable max-classes-per-file */
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';

class ImageView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLDivElement;

  img: HTMLImageElement;

  node: Node;

  view: EditorView;

  getPos?: () => number;

  constructor(node: Node, view: EditorView, getPos: () => number) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');
    const {
      align, src, title, alt, width,
    } = node.attrs;
    this.dom.style.textAlign = align;
    this.dom.style.margin = '1.5em 0';
    this.img = document.createElement('img');
    this.img.src = src;
    this.img.alt = alt ?? '';
    this.img.title = title ?? '';
    this.img.style.width = `${width}%`;
    this.dom.appendChild(this.img);
  }

  selectNode() {
    if (!isEditable(this.view.state)) return;
    this.img.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.img.classList.remove('ProseMirror-selectednode');
  }
}

export default ImageView;
