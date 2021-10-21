import { nodeNames } from '@curvenote/schema';
import { Node } from 'prosemirror-model';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import { GetPos } from './types';

export function clickSelectFigure(view: EditorView, getPos: GetPos) {
  const figure = findParentNode((n: Node) => n.type.name === nodeNames.figure)(
    TextSelection.create(view.state.doc, getPos()),
  );
  if (!figure) return;
  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, figure.pos)));
}

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
