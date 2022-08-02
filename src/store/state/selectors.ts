import { StateCounter } from '@curvenote/schema/dist/types/types';
import { createSelector } from '@reduxjs/toolkit';
import { EditorState } from 'prosemirror-state';
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

function makeSelectEditorState() {
  const selector: (
    state: State,
    stateKey: any,
  ) => {
    key: any | null;
    state: EditorState | null;
    viewIds: string[] | [];
    counts: StateCounter | null;
  } = createSelector(
    [selectEditors, (_: State, stateKey: any) => stateKey],
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
  return selector;
}
export const selectEditorState = makeSelectEditorState();

/**
 * @deprecated use selectEditorState
 */
export const getEditorState = selectEditorState;

/**
 * @deprecated use selectEditorView
 */
export const getEditorView = selectEditorViewState;
