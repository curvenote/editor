import { State } from '../types';
import { opts } from '../../connect';
import { getEditor, getEditorView } from '../state/selectors';

export function getEditorUI(state: State) {
  return state.editor.ui;
}

export function getSelectedEditorAndViews(state: State) {
  const { stateId } = getEditorUI(state);
  return getEditor(state, stateId);
}

export function getSelectedView(state: State) {
  const { viewId } = getEditorUI(state);
  return getEditorView(state, viewId);
}

export function getSelectedViewId(state: State) {
  const { stateId, viewId } = getEditorUI(state);
  return { stateId, viewId };
}

export function isEditorViewFocused(state: State, stateKey: any | null, viewId: string) {
  if (stateKey == null) return null;
  const stateId = opts.transformKeyToId(stateKey);
  const { ui } = state.editor;
  return (
    ui.stateId === stateId
    && ui.viewId === viewId
    && ui.focused
  );
}
