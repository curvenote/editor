/* eslint-disable no-param-reassign */
import { Node } from 'prosemirror-model';
import { FormatSerialize } from '../../nodes/types';

export const TAB = '  ';

type LatexOptions = {
  bracketOpts?: null | ((node: Node) => string | null);
  inline?: boolean;
};

export const latexStatement = (
  command: string,
  f: FormatSerialize,
  opts: LatexOptions = { inline: false },
): FormatSerialize => (state, node, p, i) => {
  const latexOption = opts?.bracketOpts?.(node) ?? '';
  const optsInBrackets = latexOption ? `[${latexOption}]` : '';
  state.write(opts.inline ? `\\${command}{\n` : `\\begin{${command}}${optsInBrackets}\n`);
  const old = state.delim;
  state.delim += TAB;
  f(state, node, p, i);
  state.delim = old;
  (state as any).out += opts.inline ? `\n${state.delim}}` : `\n${state.delim}\\end{${command}}`;
  state.closeBlock(node);
};

export const blankTex: FormatSerialize = (state, node) => {
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
};

export const blankTexLines: FormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
  state.ensureNewLine();
};
