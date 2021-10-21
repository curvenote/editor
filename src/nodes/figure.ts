import { TexOptions, TexFormatTypes, MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { AlignOptions, MyNodeSpec, NodeGroups } from './types';

export type Attrs = {
  align: AlignOptions;
};

const figure: MyNodeSpec<Attrs> = {
  group: NodeGroups.block,
  content: NodeGroups.insideFigure,
  attrs: {
    align: { default: 'center' },
  },
  toDOM(node) {
    const { align } = node.attrs;
    return ['figure', { align }, 0];
  },
  parseDOM: [
    {
      tag: 'figure',
      getAttrs(dom) {
        return {
          align: dom.getAttribute('align') ?? 'center',
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
  (options: TexOptions) => (options.format === TexFormatTypes.tex_curvenote ? 'callout' : 'framed'),
  (state, node) => {
    state.renderContent(node);
  },
);

export default figure;
