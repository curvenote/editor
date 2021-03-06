import { opts } from '../../connect';
import { State } from '../types';

export function getEditorView(state: State, viewId: string | null) {
  const blank = { viewId, stateId: null, view: null };
  if (viewId == null) return blank;
  const view = state.editor.state.views[viewId];
  return { viewId, ...(view ?? blank) };
}

export function getEditorState(state: State, stateKey: any | null) {
  const blank = {
    key: null,
    state: null,
    viewIds: [],
    counts: null,
  };
  const stateId = opts.transformKeyToId(stateKey);
  if (!stateId) return blank;
  const editor = state.editor.state.editors[stateId];
  return editor ?? blank;
}
