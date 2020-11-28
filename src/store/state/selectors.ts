import { EditorView } from 'prosemirror-view';
import config from '../../config';
import { State } from '../types';

export function getEditor(state: State, stateKey: any | null) {
  if (stateKey == null) return { state: null, views: [] };
  const stateId = config.transformKeyToId(stateKey);
  const editor = state.prosemirror.state.editors[stateId];
  if (!editor) return { state: null, views: [] };
  const views: EditorView[] = [];
  editor.viewIds.forEach((viewId) => {
    const { view } = state.prosemirror.state.views[viewId];
    views.push(view);
  });
  return {
    state: editor.state, views, stateId, viewIds: [...editor.viewIds],
  };
}

export function getEditorState(state: State, stateKey: any | null) {
  if (stateKey == null) return null;
  const stateId = config.transformKeyToId(stateKey);
  const editor = state.prosemirror.state.editors[stateId];
  return editor.state ?? null;
}
