import { Node } from 'prosemirror-model';
import { TexStatementOptions, TexFormatSerialize, TexSerializerState } from '../types';

export const INDENT = '  ';

export function createLatexStatement(
  opts: string | ((state: TexSerializerState, node: Node) => TexStatementOptions),
  f: TexFormatSerialize,
): TexFormatSerialize {
  return (state: TexSerializerState, node, p, i) => {
    const { command, bracketOpts, inline, before, after } =
      typeof opts === 'string' ? ({ command: opts } as TexStatementOptions) : opts(state, node);
    if (before) (state as any).out += `\n${state.delim}${before}`;
    const optsInBrackets = bracketOpts ? `[${bracketOpts}]` : '';
    state.write(inline ? `\\${command}{\n` : `\\begin{${command}}${optsInBrackets}\n`);
    const old = state.delim;
    state.delim += state.options.indent ?? INDENT;
    f(state, node, p, i);
    state.delim = old;
    (state as any).out += inline ? `\n${state.delim}}` : `\n${state.delim}\\end{${command}}`;
    if (after) (state as any).out += `\n${state.delim}${after}`;
    state.closeBlock(node);
  };
}

export const blankTex: TexFormatSerialize = (state, node) => {
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
};

export const blankTexLines: TexFormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
  state.ensureNewLine();
};

const replacements = {
  // quotes
  '’': "'",
  '‘': '`',
  '”': "''",
  '“': '``',
  // guillemots
  '»': '>>', // These could be improved
  '«': '<<',
  '…': '\\dots',
  '–': '--',
  '—': '---',
  '©': '\\textcopyright',
  '®': '\\textregistered',
  '™': '\\texttrademark',
  '½': '$\\frac{1}{2}$',
  '⅓': '$\\frac{1}{3}$',
  '⅔': '$\\frac{2}{3}$',
  '¼': '$\\frac{1}{4}$',
  '⅕': '$\\frac{1}{5}$',
  '⅖': '$\\frac{2}{5}$',
  '⅗': '$\\frac{3}{5}$',
  '⅘': '$\\frac{4}{5}$',
  '⅙': '$\\frac{1}{6}$',
  '⅚': '$\\frac{5}{6}$',
  '⅐': '$\\frac{1}{7}$',
  '⅛': '$\\frac{1}{8}$',
  '⅜': '$\\frac{3}{8}$',
  '⅝': '$\\frac{5}{8}$',
  '⅞': '$\\frac{7}{8}$',
  '⅑': '$\\frac{1}{9}$',
  '⅒': '$\\frac{1}{10}$',
  '↔': '\\leftrightarrow',
  '⇔': '\\Leftrightarrow',
  '→': '\\rightarrow',
  '⇒': '\\Rightarrow',
  '←': '\\leftarrow',
  '⇐': '\\Leftarrow',
};

export function stringToLatex(text: string) {
  // Funky placeholders (unlikely to be written ...?!)
  const backslashSpace = '💥🎯BACKSLASHSPACE🎯💥';
  const backslash = '💥🎯BACKSLASH🎯💥';
  const tilde = '💥🎯TILDE🎯💥';
  // Latex escaped characters are: \ & % $ # _ { } ~ ^
  const escaped = (text ?? '')
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

  // Replace all fancy characters after escaping is complete
  const replaced = Object.entries(replacements).reduce(
    (t, [from, to]) => t.replace(new RegExp(from, 'g'), to),
    escaped,
  );
  return replaced;
}
