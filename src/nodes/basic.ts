import OrderedMap from 'orderedmap';
import { GenericNode } from 'mystjs';
import { NodeSpec } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import { nodeNames } from '../types';
import { MyNodeSpec, NodeGroups } from './types';

export type Attrs = Record<string, never>;

export const doc: NodeSpec = {
  content: `(${NodeGroups.block} | ${NodeGroups.heading} | ${NodeGroups.top})+`,
};

export const docParagraph: NodeSpec = {
  content: 'paragraph',
};

export const docComment: NodeSpec = {
  content: `(${NodeGroups.block} | ${NodeGroups.heading} | ${nodeNames.equation})+`, // browsers will completely collapse the node when it's empty `+` is necessary
};

export const paragraph: MyNodeSpec<Attrs> = {
  attrs: {},
  content: `${NodeGroups.inline}*`,
  group: NodeGroups.block,
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return ['p', 0];
  },
  attrsFromMdastToken: () => ({}),
};

export const blockquote: MyNodeSpec<Attrs> = {
  attrs: {},
  content: `${NodeGroups.block}+`,
  group: NodeGroups.block,
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() {
    return ['blockquote', 0];
  },
  attrsFromMdastToken: () => ({}),
};

/** Horizontal rule */
export const horizontal_rule: MyNodeSpec<Attrs> = {
  attrs: {},
  group: NodeGroups.block,
  parseDOM: [{ tag: 'hr' }],
  toDOM() {
    return ['hr', { class: 'break' }];
  },
  attrsFromMdastToken: () => ({}),
};

export const text: NodeSpec = {
  group: NodeGroups.inline,
};

export const hard_break: MyNodeSpec<Attrs> = {
  attrs: {},
  inline: true,
  group: NodeGroups.inline,
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM() {
    return ['br'];
  },
  attrsFromMdastToken: () => ({}),
};

export type ListAttrs = {
  order: number | null;
};

const listNodes = addListNodes(
  OrderedMap.from({}),
  `paragraph ${NodeGroups.block}*`,
  NodeGroups.block,
) as OrderedMap<MyNodeSpec<any>>;

export type OrderedListAttrs = {
  order: number;
};

export const ordered_list = listNodes.get('ordered_list') as MyNodeSpec<OrderedListAttrs>;
ordered_list.attrsFromMdastToken = (token: GenericNode) => ({ order: token.start || 1 });
export const bullet_list = listNodes.get('bullet_list') as MyNodeSpec<Attrs>;
bullet_list.attrsFromMdastToken = () => ({});
export const list_item = listNodes.get('list_item') as MyNodeSpec<Attrs>;
list_item.attrsFromMdastToken = () => ({});
