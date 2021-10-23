import { Node } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import { GetPos } from './types';
import { clickSelectFigure } from './utils';

class ImageView implements NodeView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLDivElement;

  div: HTMLDivElement;

  iframe: HTMLIFrameElement;

  node: Node;

  view: EditorView;

  getPos?: GetPos;

  constructor(node: Node, view: EditorView, getPos: GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');
    this.dom.addEventListener('mousedown', () => clickSelectFigure(view, getPos));
    this.dom.addEventListener('click', () => clickSelectFigure(view, getPos));
    const { src, title, alt, width } = node.attrs;
    this.dom.style.margin = '1.5em 0';
    this.div = document.createElement('div');
    this.div.style.position = 'relative';
    this.div.style.display = 'inline-block';
    this.div.style.paddingBottom = `${Math.round((9 / 16) * width)}%`;
    this.div.style.width = `${width}%`;
    this.iframe = document.createElement('iframe');
    this.iframe.title = src ?? '';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.position = 'absolute';
    this.iframe.style.top = '0';
    this.iframe.style.left = '0';
    this.iframe.style.border = 'none';
    this.iframe.width = '100%';
    this.iframe.height = '100%';
    this.iframe.src = src;
    this.iframe.allowFullscreen = true;
    this.iframe.allow = 'autoplay';
    this.iframe.src = src;
    this.dom.appendChild(this.div);
    this.div.appendChild(this.iframe);
  }

  selectNode() {
    if (!isEditable(this.view.state)) return;
    this.div.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.div.classList.remove('ProseMirror-selectednode');
  }
}

export default ImageView;
