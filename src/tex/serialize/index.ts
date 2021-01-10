/* eslint-disable no-param-reassign */
import { MarkdownSerializer } from 'prosemirror-markdown';
import { isPlainURL } from './utils';
import * as nodes from '../../nodes';
import { FormatSerialize } from '../../nodes/types';

const TAB = '  ';

const heading: FormatSerialize = (state, node) => {
  const { level } = node.attrs;
  if (level === 1) state.write('\\chapter*{');
  if (level === 2) state.write('\\section*{');
  if (level === 3) state.write('\\subsection*{');
  if (level === 4) state.write('\\subsubsection*{');
  if (level === 5) state.write('\\paragraph*{');
  if (level === 6) state.write('\\subparagraph*{');
  state.renderInline(node);
  state.write('}');
  // TODO \label{sec:x}
  state.closeBlock(node);
};

const statement = (
  command: string, f: FormatSerialize, inline = false,
): FormatSerialize => (state, node, p, i) => {
  state.write(inline ? `\\${command}{\n` : `\\begin{${command}}\n`);
  const old = state.delim;
  state.delim += TAB;
  f(state, node, p, i);
  state.delim = old;
  (state as any).out += inline ? `\n${state.delim}}` : `\n${state.delim}\\end{${command}}`;
  state.closeBlock(node);
};

export const texSerializer = new MarkdownSerializer({
  text(state, node) {
    state.text(node.text ?? '', false);
  },
  paragraph(state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  heading,
  blockquote: statement('quote', (state, node) => { state.renderContent(node); }),
  code_block: statement('verbatim', (state, node) => { state.text(node.textContent, false); }),
  image: nodes.Image.toTex,
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
  ordered_list: statement('enumerate', (state, node) => {
    state.renderList(node, TAB, () => '\\item ');
  }),
  bullet_list: statement('itemize', (state, node) => {
    state.renderList(node, TAB, () => '\\item ');
  }),
  list_item(state, node) {
    state.renderContent(node);
  },
  math: nodes.Math.toTex,
  equation: nodes.Equation.toTex,
  // \usepackage{framed}
  callout: statement('framed', (state, node) => { state.renderContent(node); }),
  aside: statement('marginpar', (state, node) => { state.renderContent(node); }, true),
  // variable: nodes.Variable.toTex,
  // display: nodes.Display.toTex,
  // dynamic: nodes.Dynamic.toTex,
  // range: nodes.Range.toTex,
  // switch: nodes.Switch.toTex,
  // button: nodes.Button.toTex,
}, {
  em: {
    open: '\\textit{', close: '}', mixable: true, expelEnclosingWhitespace: true,
  },
  strong: {
    open: '\\textbf{', close: '}', mixable: true, expelEnclosingWhitespace: true,
  },
  underline: {
    open: '\\underline{', close: '}', mixable: true, expelEnclosingWhitespace: true,
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
  code: { open: '\\texttt{', close: '}', escape: false },
  // https://www.overleaf.com/learn/latex/glossaries
  // \newacronym{gcd}{GCD}{Greatest Common Divisor}
  abbr: { open: '', close: '' },
  subscript: { open: '{\\raise-.5ex\\hbox{\\tiny ', close: '}}' },
  superscript: { open: '{\\raise1ex\\hbox{\\tiny ', close: '}}' },
  // \usepackage[normalem]{ulem}
  strikethrough: { open: '\\sout{', close: '}' },
});

