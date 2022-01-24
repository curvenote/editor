import { createLatexStatement } from '../serialize/tex/utils';
import { MdFormatSerialize } from '../serialize/types';
import { NodeGroups, NumberedNode, MyNodeSpec } from './types';
import {
  convertToBooleanAttribute,
  readBooleanDomAttr,
  getNumberedAttrs,
  getNumberedDefaultAttrs,
  setNumberedAttrs,
} from './utils';

export type Attrs = NumberedNode & {
  language: string | null;
  title: string;
  linenumbers: boolean;
};

const code: MyNodeSpec<Attrs> = {
  attrs: {
    ...getNumberedDefaultAttrs(),
    language: { default: null },
    linenumbers: { default: false },
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
          linenumbers: readBooleanDomAttr(dom, 'linenumbers'),
          title: dom.getAttribute('title') ?? '',
        };
      },
    },
  ],
  toDOM(node) {
    const { language, title, linenumbers } = node.attrs;
    return [
      'pre',
      {
        ...setNumberedAttrs(node.attrs),
        language,
        title,
        linenumbers: convertToBooleanAttribute(linenumbers),
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
  () => ({
    command: 'verbatim',
  }),
  (state, node) => {
    state.renderContent(node);
  },
);

export default code;
