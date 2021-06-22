/* eslint-disable no-param-reassign */
import { FormatSerialize } from '../../nodes/types';
import { LatexOptions, LatexSerializerState, LatexStatementOptions } from './types';

export const TAB = '  ';

export const createLatexStatement =
  (
    command: string | ((options: LatexOptions) => string),
    f: FormatSerialize,
    opts: LatexStatementOptions | ((options: LatexOptions) => LatexStatementOptions) = {
      inline: false,
    },
  ): FormatSerialize =>
  (state: LatexSerializerState, node, p, i) => {
    const { bracketOpts, inline } = typeof opts === 'function' ? opts(state.options) : opts;
    const latexOption = bracketOpts?.(node) ?? '';
    const optsInBrackets = latexOption ? `[${latexOption}]` : '';
    const name = typeof command === 'function' ? command(state.options) : command;
    state.write(inline ? `\\${name}{\n` : `\\begin{${name}}${optsInBrackets}\n`);
    const old = state.delim;
    state.delim += TAB;
    f(state, node, p, i);
    state.delim = old;
    (state as any).out += inline ? `\n${state.delim}}` : `\n${state.delim}\\end{${name}}`;
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
