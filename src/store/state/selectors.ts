import { EditorView } from 'prosemirror-view';
import { opts } from '../../connect';
import { State } from '../types';

export function getEditor(state: State, stateKey: any | null) {
  if (stateKey == null) return { state: null, views: [] };
  const stateId = opts.transformKeyToId(stateKey);
  const editor = state.editor.state.editors[stateId];
  if (!editor) return { state: null, views: [] };
  const views: EditorView[] = [];
  editor.viewIds.forEach((viewId) => {
    const { view } = state.editor.state.views[viewId];
    views.push(view);
  });
  return {
    state: editor.state, views, stateId, viewIds: [...editor.viewIds],
  };
}

export function getEditorView(state: State, viewId: string | null) {
  const blank = { stateId: [], view: null };
  if (viewId == null) return blank;
  const view = state.editor.state.views[viewId];
  return view ?? blank;
}

export function getEditorState(state: State, stateKey: any | null) {
  const blank = { state: null, viewIds: [] };
  if (stateKey == null) return blank;
  const stateId = opts.transformKeyToId(stateKey);
  const editor = state.editor.state.editors[stateId];
  return editor ?? blank;
}
