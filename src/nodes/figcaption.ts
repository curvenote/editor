import { TexOptions, TexFormatTypes, MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { MyNodeSpec, NodeGroups, NumberedNode } from './types';
import { getNumberedAttrs, getNumberedDefaultAttrs, setNumberedAttrs } from './utils';

export type Attrs = NumberedNode;

const figcaption: MyNodeSpec<Attrs> = {
  content: `${NodeGroups.inline}*`,
  attrs: {
    ...getNumberedDefaultAttrs(),
  },
  draggable: false,
  defining: true,
  toDOM(node) {
    return [
      'figcaption',
      {
        ...setNumberedAttrs(node.attrs),
      },
      0,
    ];
  },
  parseDOM: [
    {
      tag: 'figcaption',
      getAttrs(dom) {
        return {
          ...getNumberedAttrs(dom),
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

export default figcaption;
