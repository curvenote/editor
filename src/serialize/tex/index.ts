import { Node as ProsemirrorNode } from 'prosemirror-model';
import { MarkdownSerializer } from 'prosemirror-markdown';
import { blankTex, blankTexLines, createLatexStatement, INDENT, stringToLatex } from './utils';
import * as nodes from '../../nodes';
import { isPlainURL } from '../markdown/utils';
import { nodeNames } from '../../types';
import { TexFormatTypes, TexOptions } from '../types';

function createMarkOpenClose(name?: string) {
  return {
    open: name ? `\\${name}{` : '',
    close: name ? '}' : '',
  };
}

export const texSerializer = new MarkdownSerializer(
  {
    text(state, node, parent) {
      if (parent.type.name === nodeNames.equation || parent.type.name === nodeNames.math) {
        state.text(node.text ?? '', false);
        return;
      }
      const escaped = stringToLatex(node.text ?? '');
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
      (state, node) => ({
        command: 'enumerate',
        bracketOpts: node.attrs.order !== 1 ? 'resume' : undefined,
      }),
      (state, node) => {
        state.renderList(node, state.options.indent ?? INDENT, () => '\\item ');
      },
    ),
    bullet_list: createLatexStatement('itemize', (state, node) => {
      state.renderList(node, state.options.indent ?? INDENT, () => '\\item ');
    }),
    list_item(state, node) {
      state.renderInline(node);
    },
    image: nodes.Image.toTex,
    figure: nodes.Figure.toTex,
    figcaption: nodes.Figcaption.toTex,
    footnote: nodes.Footnote.toTex,
    iframe: blankTexLines,
    time: nodes.Time.toTex,
    cite: nodes.Cite.toTex,
    cite_group: nodes.CiteGroup.toTex,
    mention: nodes.Mention.toTex,
    math: nodes.Math.toTex,
    equation: nodes.Equation.toTex,
    table: nodes.Table.toTex,
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
      ...createMarkOpenClose('textit'),
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    strong: {
      ...createMarkOpenClose('textbf'),
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    underline: {
      ...createMarkOpenClose('uline'),
      mixable: true,
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
    code: createMarkOpenClose('texttt'),
    // https://www.overleaf.com/learn/latex/glossaries
    // \newacronym{gcd}{GCD}{Greatest Common Divisor}
    abbr: createMarkOpenClose(),
    subscript: createMarkOpenClose('textsubscript'),
    superscript: createMarkOpenClose('textsuperscript'),
    // \usepackage[normalem]{ulem}
    strikethrough: createMarkOpenClose('sout'),
  },
);

export function toTex(doc: ProsemirrorNode, opts?: TexOptions) {
  const defualtOpts = { tightLists: true, format: TexFormatTypes.tex, indent: INDENT };
  return texSerializer.serialize(doc, { ...defualtOpts, ...opts });
}
