import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  ProsemirrorActionTypes,
  UPDATE_PROSEMIRROR_STATE, INIT_PROSEMIRROR_STATE,
  SUBSCRIBE_PROSEMIRROR_VIEW, UNSUBSCRIBE_PROSEMIRROR_VIEW,
} from './types';
import { AppThunk } from '../types';
import { getEditor } from './selectors';
import config from '../../config';

export function initEditorState(
  stateKey: any, editable: boolean, content: string, version: number,
): ProsemirrorActionTypes {
  const stateId = config.transformKeyToId(stateKey);
  return {
    type: INIT_PROSEMIRROR_STATE,
    payload: {
      stateId, editable, content, version,
    },
  };
}

export function updateProsemirrorState(
  stateKey: any, viewId: string | null, editorState: EditorState,
): ProsemirrorActionTypes {
  const stateId = config.transformKeyToId(stateKey);
  return {
    type: UPDATE_PROSEMIRROR_STATE,
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
    dispatch(updateProsemirrorState(stateKey, null, next));
    return true;
  };
}

export function subscribeView(
  stateKey: any, viewId: string, view: EditorView,
): ProsemirrorActionTypes {
  const stateId = config.transformKeyToId(stateKey);
  return {
    type: SUBSCRIBE_PROSEMIRROR_VIEW,
    payload: { stateId, viewId, view },
  };
}

export function unsubscribeView(
  stateKey: any, viewId: string,
): ProsemirrorActionTypes {
  const stateId = config.transformKeyToId(stateKey);
  return {
    type: UNSUBSCRIBE_PROSEMIRROR_VIEW,
    payload: { stateId, viewId },
  };
}
