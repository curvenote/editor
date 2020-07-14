import { NodeSpec } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import OrderedMap from 'orderedmap';
import { NodeGroups } from './types';

export const paragraph: NodeSpec = {
  content: `${NodeGroups.inline}*`,
  group: NodeGroups.block,
  parseDOM: [{ tag: 'p' }],
  toDOM() { return ['p', 0]; },
};

export const blockquote: NodeSpec = {
  content: `${NodeGroups.block}+`,
  group: NodeGroups.block,
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() { return ['blockquote', 0]; },
};

/** Horizontal rule */
export const horizontal_rule: NodeSpec = {
  group: NodeGroups.block,
  parseDOM: [{ tag: 'hr' }],
  toDOM() { return ['hr']; },
};

export const heading: NodeSpec = {
  attrs: { level: { default: 1 } },
  content: `${NodeGroups.inline}*`,
  group: NodeGroups.block,
  defining: true,
  parseDOM: [
    { tag: 'h1', attrs: { level: 1 } },
    { tag: 'h2', attrs: { level: 2 } },
    { tag: 'h3', attrs: { level: 3 } },
    { tag: 'h4', attrs: { level: 4 } },
    { tag: 'h5', attrs: { level: 5 } },
    { tag: 'h6', attrs: { level: 6 } },
  ],
  toDOM(node) { return [`h${node.attrs.level}`, 0]; },
};

export const code_block: NodeSpec = {
  content: `${NodeGroups.text}*`,
  marks: '',
  group: NodeGroups.block,
  code: true,
  defining: true,
  parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
  toDOM() { return ['pre', ['code', 0]]; },
};

export const text: NodeSpec = {
  group: NodeGroups.inline,
};

export const image: NodeSpec = {
  inline: true,
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
  },
  group: NodeGroups.inline,
  draggable: true,
  parseDOM: [{
    tag: 'img[src]',
    getAttrs(dom: any) {
      return {
        src: dom.getAttribute('src'),
        title: dom.getAttribute('title'),
        alt: dom.getAttribute('alt'),
      };
    },
  }],
  toDOM(node) { const { src, alt, title } = node.attrs; return ['img', { src, alt, title }]; },
};

export const hard_break: NodeSpec = {
  inline: true,
  group: NodeGroups.inline,
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM() { return ['br']; },
};

const listNodes = addListNodes(OrderedMap.from({}), `paragraph ${NodeGroups.block}*`, NodeGroups.block);

export const ordered_list = listNodes.get('ordered_list') as NodeSpec;
export const bullet_list = listNodes.get('bullet_list') as NodeSpec;
export const list_item = listNodes.get('list_item') as NodeSpec;
