import { createLatexStatement } from '../serialize/tex/utils';
import { TexFormatTypes, TexOptions, MdFormatSerialize } from '../serialize/types';
import { NodeGroups, NumberedNode, MyNodeSpec } from './types';
import { getNumberedAttrs, getNumberedDefaultAttrs, setNumberedAttrs } from './utils';

export type Attrs = NumberedNode & {
  language: string | null;
  title: string;
};

const code: MyNodeSpec<Attrs> = {
  attrs: {
    ...getNumberedDefaultAttrs(),
    language: { default: null },
    title: { default: '' },
  },
  content: `${NodeGroups.text}*`,
  marks: '',
  group: NodeGroups.block,
  code: true,
  defining: true,
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs(dom) {
        return {
          ...getNumberedAttrs(dom),
          language: dom.getAttribute('language') || null,
          title: dom.getAttribute('title') ?? '',
        };
      },
    },
  ],
  toDOM(node) {
    const { language, title } = node.attrs;
    return [
      'pre',
      {
        ...setNumberedAttrs(node.attrs),
        language,
        title,
      },
      ['code', 0],
    ];
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  const { language } = node.attrs;
  state.write(`\`\`\`${language || ''}\n`);
  state.text(node.textContent, false);
  state.ensureNewLine();
  state.write('```');
  state.closeBlock(node);
};

export const toTex = createLatexStatement(
  (options: TexOptions) => (options.format === TexFormatTypes.tex_curvenote ? 'code' : 'verbatim'),
  (state, node) => {
    state.renderContent(node);
  },
);

export default code;
