import OrderedMap from 'orderedmap';
import type { GenericNode } from 'mystjs';
import type { NodeSpec } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import type {
  Blockquote,
  Break,
  FlowContent,
  List,
  ListContent,
  ListItem,
  NoAttrs,
  Paragraph,
  PhrasingContent,
  ThematicBreak,
} from '../spec';
import type { MyNodeSpec, NodeGroup, Props } from './types';
import { ARTICLE_NODE_GROUPS, LEGACY_NODE_GROUPS } from './types';
import { nodeNames } from '../types';

export const doc: NodeSpec = {
  content: `(${LEGACY_NODE_GROUPS.content} | ${LEGACY_NODE_GROUPS.heading} | ${LEGACY_NODE_GROUPS.top})+`,
};
export const docWithBlock: NodeSpec = {
  content: `${ARTICLE_NODE_GROUPS.block}+`,
};
export const block: NodeSpec = {
  attrs: { id: { default: null } },
  draggable: true,
  isolating: true,
  content: `(${ARTICLE_NODE_GROUPS.content} | ${ARTICLE_NODE_GROUPS.heading} | ${ARTICLE_NODE_GROUPS.top})+`,
  group: ARTICLE_NODE_GROUPS.block,
  parseDOM: [
    {
      tag: 'div.block',
      getAttrs(dom) {
        if (dom instanceof HTMLElement) {
          return {
            id: dom.getAttribute('id') || null,
          };
        }
        return {
          id: null,
        };
      },
    },
  ],

  toDOM({ attrs: { id } }) {
    return ['div', { class: 'block', id }, 0];
  },
};

export function createBasicNodeSpecs(nodeGroup: NodeGroup) {
  const docParagraph: NodeSpec = {
    content: 'paragraph',
  };
  const docComment: NodeSpec = {
    content: `(${nodeGroup.content} | ${nodeGroup.heading} | ${nodeNames.equation})+`, // browsers will completely collapse the node when it's empty `+` is necessary
  };

  const paragraph: MyNodeSpec<NoAttrs, Paragraph> = {
    attrs: {},
    content: `${nodeGroup.inline}*`,
    group: nodeGroup.content,
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', 0];
    },
    attrsFromMyst: () => ({}),
    toMyst: (props) => ({
      type: 'paragraph',
      children: (props.children || []) as PhrasingContent[],
    }),
  };

  const blockquote: MyNodeSpec<NoAttrs, Blockquote> = {
    attrs: {},
    content: `${nodeGroup.content}+`,
    group: nodeGroup.content,
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return ['blockquote', 0];
    },
    attrsFromMyst: () => ({}),
    toMyst: (props) => ({
      type: 'blockquote',
      children: (props.children || []) as FlowContent[],
    }),
  };

  /** Horizontal rule */
  const horizontal_rule: MyNodeSpec<NoAttrs, ThematicBreak> = {
    attrs: {},
    group: nodeGroup.content,
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return ['hr', { class: 'break' }];
    },
    attrsFromMyst: () => ({}),
    toMyst: (): ThematicBreak => ({ type: 'thematicBreak' }),
  };

  const text: NodeSpec = {
    group: nodeGroup.inline,
  };

  const hard_break: MyNodeSpec<NoAttrs, Break> = {
    attrs: {},
    inline: true,
    group: nodeGroup.inline,
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return ['br'];
    },
    attrsFromMyst: () => ({}),
    toMyst: (): Break => ({ type: 'break' }),
  };

  const listNodes = addListNodes(
    OrderedMap.from({}),
    `paragraph ${nodeGroup.content}*`,
    nodeGroup.content,
  ) as OrderedMap<MyNodeSpec<any, any>>;

  const ordered_list = listNodes.get('ordered_list') as MyNodeSpec<OrderedListAttrs, List>;
  ordered_list.attrsFromMyst = (token: GenericNode) => ({ order: token.start || 1 });
  ordered_list.toMyst = (props: Props) => ({
    type: 'list',
    ordered: true,
    // This feels like it should be `start: props.order`, but it
    // is in fact correct as is since we are grabbing these props
    // off the HTML in `convertToMdast`, not the prosemirror node
    // https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L17
    start: props.start || undefined,
    children: (props.children || []) as ListContent[],
  });

  const bullet_list = listNodes.get('bullet_list') as MyNodeSpec<NoAttrs, List>;
  bullet_list.attrsFromMyst = () => ({});
  bullet_list.toMyst = (props: Props) => ({
    type: 'list',
    ordered: false,
    children: (props.children || []) as ListContent[],
  });

  const list_item = listNodes.get('list_item') as MyNodeSpec<NoAttrs, ListItem>;
  list_item.attrsFromMyst = () => ({});
  list_item.toMyst = (props: Props) => {
    let { children } = props;
    if (children && children.length === 1 && children[0].type === 'paragraph') {
      children = children[0].children;
    }
    return {
      type: 'listItem',
      children: (children || []) as PhrasingContent[],
    };
  };

  return {
    docParagraph,
    docComment,
    paragraph,
    blockquote,
    horizontal_rule,
    text,
    hard_break,
    listNodes,
    ordered_list,
    bullet_list,
    list_item,
  };
}
export type OrderedListAttrs = {
  order: number;
};
