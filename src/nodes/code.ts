import { LatexFormatTypes, LatexOptions } from '../serialize/tex/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { NodeGroups, NumberedNode, MyNodeSpec, FormatSerialize } from './types';
import { getNumberedAttrs, getNumberedDefaultAttrs, setNumberedAttrs } from './utils';

export type Attrs = NumberedNode & {
  language: string | null;
  title: string;
  linenumber: boolean;
};

const code: MyNodeSpec<Attrs> = {
  attrs: {
    ...getNumberedDefaultAttrs(),
    language: { default: null },
    linenumber: { default: true },
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
          linenumber: dom.getAttribute('linenumber') === 'true',
          title: dom.getAttribute('title') ?? '',
        };
      },
    },
  ],
  toDOM(node) {
    const { language, title, linenumber } = node.attrs;
    return [
      'pre',
      {
        ...setNumberedAttrs(node.attrs),
        language,
        title,
        linenumber,
      },
      ['code', 0],
    ];
  },
};

export const toMarkdown: FormatSerialize = (state, node) => {
  const { language } = node.attrs;
  state.write(`\`\`\`${language || ''}\n`);
  state.text(node.textContent, false);
  state.ensureNewLine();
  state.write('```');
  state.closeBlock(node);
};

export const toTex = createLatexStatement(
  (options: LatexOptions) =>
    options.format === LatexFormatTypes.tex_curvenote ? 'code' : 'verbatim',
  (state, node) => {
    state.renderContent(node);
  },
);

export default code;
