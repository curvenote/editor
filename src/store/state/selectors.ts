import { createSelector } from '@reduxjs/toolkit';
import { opts } from '../../connect';
import { State } from '../types';

export function selectEditors(state: State) {
  return state.editor.state.editors;
}

export function selectViews(state: State) {
  return state.editor.state.views;
}

export const selectEditorViewState = createSelector(
  [selectViews, (_: State, viewId: string | null) => viewId],
  (views, viewId) => {
    const blank = { viewId, stateId: null, view: null };
    if (viewId == null) return blank;
    const view = views[viewId];
    return { viewId, ...(view ?? blank) };
  },
);

export const selectEditorState = createSelector(
  [selectEditors, (_: State, stateKey: string | null) => stateKey],
  (editors, stateKey) => {
    const blank = {
      key: null,
      state: null,
      viewIds: [],
      counts: null,
    };
    const stateId = opts.transformKeyToId(stateKey);
    if (!stateId) return blank;
    const editor = editors[stateId];
    return editor ?? blank;
  },
);

/**
 * @deprecated use selectEditorState
 */
export const getEditorState = selectEditorState;

/**
 * @deprecated use selectEditorView
 */
export const getEditorView = selectEditorViewState;
