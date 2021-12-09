/* eslint-disable no-param-reassign */
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
