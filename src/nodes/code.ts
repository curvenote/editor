import { Code } from 'myst-spec';
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

// TODO: Can we rename this to code_block...?
const code: MyNodeSpec<Attrs, Code> = {
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
  attrsFromMdastToken: (token) => ({
    id: token.identifier || null,
    label: token.label || null,
    numbered: token.numbered || false,
    language: token.lang || null,
    linenumbers: token.showLineNumbers || false,
    title: '',
  }),
  toMyst: (props): Code => {
    if (props.children?.length === 1) {
      return {
        type: 'code',
        lang: props.language || undefined,
        showLineNumbers: props.linenumbers || undefined,
        value: props.children[0].value || '',
      };
    }
    throw new Error(`Code block node does not have one child`);
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
