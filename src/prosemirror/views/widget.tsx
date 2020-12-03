/* eslint-disable max-classes-per-file */
import { Node, DOMOutputSpecArray } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import schema from '../schema';
import { openAttributeEditor } from '../../store/attrs/actions';
import { store } from '../../connect';

class WidgetView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement;

  widget: HTMLElement;

  node: Node;

  view: EditorView;

  getPos?: () => number;

  constructor(node: Node, view: EditorView, getPos: (() => number) | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement<'div'>('div');
    this.dom.classList.add('widget', `widget-${node.type.name}`);
    this.dom.addEventListener('contextmenu', (event) => {
      store.dispatch(openAttributeEditor(true, getPos?.() || 0, this.dom));
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }, true);
    const widgetTag = (node.type.spec.toDOM?.(node) as DOMOutputSpecArray)?.[0] ?? 'span';
    this.widget = document.createElement(widgetTag);
    this.setAttrs(node);
    this.dom.append(this.widget);
  }

  selectNode() {
    this.widget.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.widget.classList.remove('ProseMirror-selectednode');
  }

  update(node: Node) {
    if (node.type !== schema.nodes.range) return false;
    this.setAttrs(node);
    return true;
  }

  setAttrs(node: Node) {
    const attrs = (node.type.spec.toDOM?.(node) as DOMOutputSpecArray)?.[1] ?? {};
    Object.entries(attrs).forEach(([key, value]) => {
      this.widget.setAttribute(key, value);
    });
  }
}

export const newWidgetView = (
  node: Node, view: EditorView, getPos: boolean | (() => number),
) => (
  new WidgetView(node, view, getPos as () => number)
);

export default WidgetView;
