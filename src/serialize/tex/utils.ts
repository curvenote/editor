/* eslint-disable no-param-reassign */
import { TexStatementOptions, TexFormatSerialize, TexOptions, TexSerializerState } from '../types';

export const TAB = '  ';

export const createLatexStatement =
  (
    command: string | ((options: TexOptions) => string),
    f: TexFormatSerialize,
    opts: TexStatementOptions | ((options: TexOptions) => TexStatementOptions) = {
      inline: false,
    },
  ): TexFormatSerialize =>
  (state: TexSerializerState, node, p, i) => {
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

export const blankTex: TexFormatSerialize = (state, node) => {
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
};

export const blankTexLines: TexFormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
  state.ensureNewLine();
};
