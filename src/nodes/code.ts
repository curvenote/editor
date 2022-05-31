import { Code } from '../spec';
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

const toLanguage: Record<string, string> = {
  text: 'text/plain',
  js: 'javascript',
  json: 'Json',
  cpp: 'text/x-c++src',
  'c++': 'text/x-c++src',
  c: 'text/x-csrc',
  csharp: 'text/x-csharp',
  objectivec: 'text/x-objectivec',
  java: 'text/x-java',
  scala: 'text/x-scala',
  html: 'htmlmixed',
  yaml: 'text/x-yaml',
};

const fromLanguage: Record<string, string> = {
  'text/plain': 'text',
  javascript: 'js',
  Json: 'json',
  'text/x-c++src': 'cpp',
  'text/x-csrc': 'c',
  'text/x-csharp': 'csharp',
  'text/x-objectivec': 'objectivec',
  'text/x-java': 'java',
  'text/x-scala': 'scala',
  htmlmixed: 'html',
  'text/x-yaml': 'yaml',
};

function languageToLang(language?: string): string | undefined {
  if (!language) return undefined;
  const translation = fromLanguage[language];
  if (translation) return translation;
  return language.toLowerCase();
}

function langToLanguage(lang?: string): string | undefined {
  if (!lang) return undefined;
  const translation = toLanguage[lang.toLowerCase()];
  if (translation) return translation;
  return lang.toLowerCase();
}

const code_block: MyNodeSpec<Attrs, Code> = {
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
  attrsFromMyst: (token) => ({
    id: token.identifier || null,
    label: token.label || null,
    numbered: false,
    language: langToLanguage(token.lang) || null,
    linenumbers: token.showLineNumbers || false,
    title: '',
  }),
  toMyst: (props) => {
    if (props.children?.length === 1) {
      return {
        type: 'code',
        lang: languageToLang(props.language || undefined),
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

export default code_block;
