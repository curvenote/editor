import { SharedSerializerState } from './types';

const INDENT = '  ';

export function getIndent(state: SharedSerializerState): string {
  return state.options.indent ?? INDENT;
}

export function indent(state: SharedSerializerState): () => void {
  const current = state.delim;
  state.delim += getIndent(state);
  function dedent() {
    state.delim = current;
  }
  return dedent;
}
