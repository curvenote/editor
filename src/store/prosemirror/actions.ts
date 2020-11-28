import { EditorState, NodeSelection, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { toggleMark as toggleMarkPM, wrapIn as wrapInPM, setBlockType as setBlockTypePM } from 'prosemirror-commands';
import { wrapInList as wrapInListPM, liftListItem } from 'prosemirror-schema-list';
import { MarkType, NodeType } from 'prosemirror-model';
import {
  ProsemirrorActionTypes,
  UPDATE_PROSEMIRROR_STATE, INIT_PROSEMIRROR_STATE,
  SUBSCRIBE_PROSEMIRROR_VIEW, UNSUBSCRIBE_PROSEMIRROR_VIEW, SELECT_EDITOR_VIEW, FOCUS_EDITOR_VIEW,
} from './types';
import { State, AppThunk } from '../types';
import { getEditor, getEditorState, selectionIsChildOf } from './selectors';
import schema from '../../prosemirror/schema';
import config from '../../config';

function selectNode(stateId: any, pos: number) {
  return (dispatch: any, getState: () => State) => {
    const editor = getEditor(getState(), stateId);
    if (editor.state == null) return;
    const transaction = editor.state.tr.setSelection(NodeSelection.create(editor.state.doc, pos));
    dispatch({
      type: UPDATE_PROSEMIRROR_STATE,
      payload: { stateId, transaction },
    });
  };
}


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


export function selectEditorView(stateKey: any, viewId: string): ProsemirrorActionTypes {
  const stateId = config.transformKeyToId(stateKey);
  return {
    type: SELECT_EDITOR_VIEW,
    payload: { stateId, viewId },
  };
}

export function focusEditorView(
  stateKey: any, viewId: string | null, focused: boolean,
): ProsemirrorActionTypes {
  const stateId = config.transformKeyToId(stateKey);
  return {
    type: FOCUS_EDITOR_VIEW,
    payload: { stateId, viewId, focused },
  };
}
export function toggleMark(
  stateKey: any, viewId: string | null, mark: MarkType, attrs?: {[key: string]: any},
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey);
    if (editorState == null) return false;
    const action = toggleMarkPM(mark, attrs);
    const result = action(
      editorState,
      (tr: Transaction) => dispatch(applyProsemirrorTransaction(stateKey, tr)),
    );
    if (result) dispatch(focusEditorView(stateKey, viewId, true));
    return result;
  };
}

export function wrapInList(
  stateKey: string, viewId: string | null, node: NodeType, test = false,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey);
    if (editorState == null) return false;
    const action = selectionIsChildOf(getState(), stateKey, { node }).node
      ? liftListItem(schema.nodes.list_item)
      : wrapInListPM(node);
    if (test) return action(editorState);
    const result = action(
      editorState,
      (tr: Transaction) => dispatch(applyProsemirrorTransaction(stateKey, tr)),
    );
    if (result) dispatch(focusEditorView(stateKey, viewId, true));
    return result;
  };
}
