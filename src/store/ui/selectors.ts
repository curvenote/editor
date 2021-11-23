import { PopperPlacementType } from '@material-ui/core';
import { State } from '../types';
import { getEditorState, getEditorView } from '../state/selectors';

export function getEditorUI(state: State) {
  return state.editor.ui;
}

export function getEditorUIStateAndViewIds(state: State) {
  const { stateId, viewId } = state.editor.ui;
  return { stateId, viewId };
}

export function isInlineActionOpen(state: State) {
  return state.editor.ui.selection != null;
}
export function getInlineActionAnchorEl(state: State) {
  return state.editor.ui.selection?.anchorEl ?? null;
}
export function getInlineActionKind(state: State) {
  return state.editor.ui.selection?.kind ?? null;
}
export function getInlineActionPlacement(state: State) {
  return state.editor.ui.selection?.placement ?? ('bottom-start' as PopperPlacementType);
}

export function getSelectedView(state: State) {
  const { viewId } = getEditorUI(state);
  return getEditorView(state, viewId);
}

export function getSelectedEditorAndViews(state: State) {
  const { stateId, viewId } = getEditorUI(state);
  return { ...getEditorState(state, stateId), ...getEditorView(state, viewId), viewId };
}

export function getSelectedViewId(state: State) {
  const { stateId, viewId } = getEditorUI(state);
  return { stateId, viewId };
}

export function isEditorViewFocused(state: State, viewId: string | null): boolean {
  return getEditorView(state, viewId).view?.hasFocus() ?? false;
}
