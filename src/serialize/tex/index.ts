import { Node as ProsemirrorNode } from 'prosemirror-model';
import { MarkdownSerializer } from 'prosemirror-markdown';
import { blankTex, blankTexLines, createLatexStatement, TAB } from './utils';
import * as nodes from '../../nodes';
import { isPlainURL } from '../markdown/utils';
import { nodeNames } from '../../schemas';
import { LatexFormatTypes, LatexOptions } from './types';

export const texSerializer = new MarkdownSerializer(
  {
    text(state, node, parent) {
      if (parent.type.name === nodeNames.equation || parent.type.name === nodeNames.math) {
        state.text(node.text ?? '', false);
        return;
      }
      // Funky placeholders (unlikely to be written ...?!)
      const backslashSpace = '💥🎯BACKSLASHSPACE🎯💥';
      const backslash = '💥🎯BACKSLASH🎯💥';
      const tilde = '💥🎯TILDE🎯💥';
      // Latex escaped characters are: \ & % $ # _ { } ~ ^
      const escaped = (node.text ?? '')
        .replace(/\\ /g, backslashSpace)
        .replace(/\\/g, backslash)
        .replace(/~/g, tilde)
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\^/g, '\\^')
        .replace(new RegExp(backslashSpace, 'g'), '{\\textbackslash}~')
        .replace(new RegExp(backslash, 'g'), '{\\textbackslash}')
        .replace(new RegExp(tilde, 'g'), '{\\textasciitilde}');
      state.text(escaped, false);
    },
    paragraph(state, node) {
      state.renderInline(node);
      state.closeBlock(node);
    },
    heading: nodes.Heading.toTex,
    blockquote: createLatexStatement('quote', (state, node) => {
      state.renderContent(node);
    }),
    code_block: nodes.Code.toTex,
    horizontal_rule(state, node) {
      state.write('\n\\bigskip\n\\centerline{\\rule{13cm}{0.4pt}}\n\\bigskip');
      state.closeBlock(node);
    },
    hard_break(state, node, parent, index) {
      for (let i = index + 1; i < parent.childCount; i += 1) {
        if (parent.child(i).type !== node.type) {
          state.write('\\\\\n');
          return;
        }
      }
    },
    ordered_list: createLatexStatement(
      'enumerate',
      (state, node) => {
        state.renderList(node, TAB, () => '\\item ');
      },
      {
        bracketOpts: (node) => {
          if (node.attrs.order !== 1) return 'resume';
          return null;
        },
      },
    ),
    bullet_list: createLatexStatement('itemize', (state, node) => {
      state.renderList(node, TAB, () => '\\item ');
    }),
    list_item(state, node) {
      state.renderInline(node);
    },
    image: nodes.Image.toTex,
    iframe: blankTexLines,
    time: nodes.Time.toTex,
    cite: nodes.Cite.toTex,
    table: nodes.Table.toTex,
    cite_group: nodes.CiteGroup.toTex,
    math: nodes.Math.toTex,
    equation: nodes.Equation.toTex,
    // \usepackage{framed}
    callout: nodes.Callout.toTex,
    aside: nodes.Aside.toTex,
    variable: blankTexLines,
    display: blankTex,
    dynamic: blankTex,
    range: blankTex,
    switch: blankTex,
    button: blankTex,
  },
  {
    em: {
      open: '\\textit{',
      close: '}',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    strong: {
      open: '\\textbf{',
      close: '}',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    underline: {
      open: '\\uline{',
      close: '}',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    link: {
      open(_state, mark, parent, index) {
        return isPlainURL(mark, parent, index, 1) ? '\\url{' : `\\href{${mark.attrs.href}}{`;
      },
      close() {
        // TODO: no title? mark.attrs.title
        return '}';
      },
    },
    code: { open: '\\texttt{', close: '}' },
    // https://www.overleaf.com/learn/latex/glossaries
    // \newacronym{gcd}{GCD}{Greatest Common Divisor}
    abbr: { open: '', close: '' },
    subscript: { open: '\\textsubscript{', close: '}' },
    superscript: { open: '\\textsuperscript{', close: '}' },
    // \usepackage[normalem]{ulem}
    strikethrough: { open: '\\sout{', close: '}' },
  },
);

export function toTex(
  doc: ProsemirrorNode,
  options: LatexOptions = { format: LatexFormatTypes.tex },
) {
  const opts = { ...options };
  opts.tightLists = opts.tightLists === undefined ? true : opts.tightLists;
  return texSerializer.serialize(doc, opts);
}
