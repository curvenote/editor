/* eslint-disable no-param-reassign */
import { FormatSerialize } from '../../nodes/types';

export const TAB = '  ';

export const latexStatement = (
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

export const blankTex: FormatSerialize = (state, node) => {
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
};

export const blankTexLines: FormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
  state.ensureNewLine();
};
