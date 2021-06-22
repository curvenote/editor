import { NodeSpec } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import OrderedMap from 'orderedmap';
import { NodeGroups } from './types';

export const doc: NodeSpec = {
  content: `(${NodeGroups.block} | ${NodeGroups.top})+`,
};

export const docParagraph: NodeSpec = {
  content: 'paragraph',
};

export const paragraph: NodeSpec = {
  content: `${NodeGroups.inline}*`,
  group: NodeGroups.block,
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return ['p', 0];
  },
};

export const blockquote: NodeSpec = {
  content: `${NodeGroups.block}+`,
  group: NodeGroups.block,
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() {
    return ['blockquote', 0];
  },
};

/** Horizontal rule */
export const horizontal_rule: NodeSpec = {
  group: NodeGroups.block,
  parseDOM: [{ tag: 'hr' }],
  toDOM() {
    return ['hr', { class: 'break' }];
  },
};

export const text: NodeSpec = {
  group: NodeGroups.inline,
};

export const hard_break: NodeSpec = {
  inline: true,
  group: NodeGroups.inline,
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM() {
    return ['br'];
  },
};

const listNodes = addListNodes(
  OrderedMap.from({}),
  `paragraph ${NodeGroups.block}*`,
  NodeGroups.block,
);

export const ordered_list = listNodes.get('ordered_list') as NodeSpec;
export const bullet_list = listNodes.get('bullet_list') as NodeSpec;
export const list_item = listNodes.get('list_item') as NodeSpec;
