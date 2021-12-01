import { MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { MyNodeSpec, NodeGroups, CaptionKind } from './types';

export type Attrs = {
  kind: CaptionKind | null;
};

const figcaption: MyNodeSpec<Attrs> = {
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
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  const { kind } = node.attrs;
  // TODO: Translate between callout/admonition
  state.write(`\`\`\`{${kind || 'note'}}`);
  state.ensureNewLine();
  state.renderContent(node);
  state.write('```');
  state.closeBlock(node);
};

export const toTex = createLatexStatement(
  () => ({ command: 'caption', inline: true }),
  (state, node) => state.renderInline(node),
);

export default figcaption;
