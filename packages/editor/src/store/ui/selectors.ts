import { PopperPlacementType } from '@material-ui/core';
import { createSelector } from '@reduxjs/toolkit';
import { State } from '../types';
import { getEditorState, getEditorView, selectEditorViewState } from '../state/selectors';

export function getEditorUI(state: State) {
  return state.editor.ui;
}

export const getEditorUIStateAndViewIds = createSelector([getEditorUI], ({ stateId, viewId }) => {
  return { stateId, viewId };
});

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

export const getSelectedViewId = createSelector([getEditorUI], ({ stateId, viewId }) => ({
  stateId,
  viewId,
}));

export const isEditorViewFocused = createSelector([selectEditorViewState], (editorView) => {
  return editorView.view?.hasFocus() ?? false;
});
