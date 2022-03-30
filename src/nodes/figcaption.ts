import { GenericNode } from 'mystjs';
import { Caption, FlowContent } from 'myst-spec';
import { MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { MyNodeSpec, NodeGroups, CaptionKind } from './types';
import { nodeNames } from '../types';

export type Attrs = {
  kind: CaptionKind | null;
};

const figcaption: MyNodeSpec<Attrs, Caption> = {
  content: `${NodeGroups.inline}*`,
  attrs: {
    kind: { default: null },
  },
  draggable: false,
  defining: true,
  toDOM(node) {
    const { kind } = node.attrs as Attrs;
    return [
      'figcaption',
      {
        kind: kind ?? undefined,
      },
      0,
    ];
  },
  parseDOM: [
    {
      tag: 'figcaption',
      getAttrs(dom) {
        return {
          kind: dom.getAttribute('kind') ?? null,
        };
      },
    },
  ],
  attrsFromMdastToken: (token, tokens) => {
    const adjacentTypes = tokens.map((t: GenericNode) => t.type);
    return { kind: adjacentTypes.includes(nodeNames.table) ? CaptionKind.table : CaptionKind.fig };
  },
  toMyst: (props): Caption => ({
    type: 'caption',
    children: (props.children || []) as FlowContent[],
  }),
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.renderInline(node);
  state.closeBlock(node);
};

export const toTex = createLatexStatement(
  (state, node) => {
    if (state.isInTable && node.attrs.kind !== CaptionKind.table) {
      return null;
    }
    const { nextCaptionNumbered: numbered, nextCaptionId: id } = state;
    return {
      command: numbered === false ? 'caption*' : 'caption',
      inline: true,
      after: numbered && id ? `\\label{${id}}` : '',
    };
  },
  (state, node) => state.renderInline(node),
);

export default figcaption;
