import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  EditorActionTypes,
  UPDATE_EDITOR_STATE, INIT_EDITOR_STATE,
  SUBSCRIBE_EDITOR_VIEW, UNSUBSCRIBE_EDITOR_VIEW,
  RESET_ALL_EDITORS_AND_VIEWS, RESET_ALL_VIEWS,
} from './types';
import { AppThunk } from '../types';
import { getEditor } from './selectors';
import { opts } from '../../connect';

export function initEditorState(
  stateKey: any, editable: boolean, content: string, version: number,
): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  return {
    type: INIT_EDITOR_STATE,
    payload: {
      stateKey, stateId, editable, content, version,
    },
  };
}

export function updateEditorState(
  stateKey: any, viewId: string | null, editorState: EditorState,
): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  return {
    type: UPDATE_EDITOR_STATE,
    payload: { stateId, viewId, editorState },
  };
}

export function applyProsemirrorTransaction(
  stateKey: any, tr: Transaction,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getEditor(getState(), stateKey);
    if (editor.state == null) return true;
    const next = editor.state.apply(tr);
    dispatch(updateEditorState(stateKey, null, next));
    return true;
  };
}

export function subscribeView(
  stateKey: any, viewId: string, view: EditorView,
): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  return {
    type: SUBSCRIBE_EDITOR_VIEW,
    payload: { stateId, viewId, view },
  };
}

export function unsubscribeView(
  stateKey: any, viewId: string,
): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  return {
    type: UNSUBSCRIBE_EDITOR_VIEW,
    payload: { stateId, viewId },
  };
}

export function resetAllEditorsAndViews(): EditorActionTypes {
  return {
    type: RESET_ALL_EDITORS_AND_VIEWS,
  };
}

export function resetAllViews(): EditorActionTypes {
  return {
    type: RESET_ALL_VIEWS,
  };
}
