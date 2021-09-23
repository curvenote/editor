import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schemas, process } from '@curvenote/schema';
import {
  EditorActionTypes,
  UPDATE_EDITOR_STATE,
  INIT_EDITOR_STATE,
  SUBSCRIBE_EDITOR_VIEW,
  UNSUBSCRIBE_EDITOR_VIEW,
  RESET_ALL_EDITORS_AND_VIEWS,
  RESET_ALL_VIEWS,
} from './types';
import { AppThunk } from '../types';
import { getEditorState, getEditorView } from './selectors';
import { opts } from '../../connect';

export function initEditorState(
  useSchema: schemas.UseSchema,
  stateKey: any,
  editable: boolean,
  content: string,
  version: number,
): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  return {
    type: INIT_EDITOR_STATE,
    payload: {
      useSchema,
      stateKey,
      stateId,
      editable,
      content,
      version,
    },
  };
}

export function updateEditorState(
  stateKey: any,
  viewId: string | null,
  editorState: EditorState,
  tr: Transaction,
): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  const counts = tr.docChanged ? process.countState(editorState) : null;
  return {
    type: UPDATE_EDITOR_STATE,
    payload: {
      stateId,
      viewId,
      editorState,
      counts,
      tr,
    },
  };
}

export function applyProsemirrorTransaction(
  stateKey: any,
  viewId: string | null,
  tr: Transaction,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const { view } = getEditorView(getState(), viewId);
    if (view) {
      view.dispatch(tr);
      return true;
    }
    const editor = getEditorState(getState(), stateKey);
    if (editor.state == null) return true;
    const next = editor.state.apply(tr);
    dispatch(updateEditorState(stateKey, null, next, tr));
    return true;
  };
}

export function subscribeView(stateKey: any, viewId: string, view: EditorView): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  return {
    type: SUBSCRIBE_EDITOR_VIEW,
    payload: { stateId, viewId, view },
  };
}

export function unsubscribeView(stateKey: any, viewId: string): EditorActionTypes {
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
