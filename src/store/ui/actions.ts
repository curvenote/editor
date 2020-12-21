import { v4 as uuid } from 'uuid';
import {
  UI_CONNECT_ANCHOR, UI_DESELECT_COMMENT, UI_DISCONNECT_ANCHOR,
  UI_CONNECT_COMMENT, UI_SELECT_ANCHOR, UI_SELECT_COMMENT, UI_DISCONNECT_COMMENT,
} from './types';
import { AppThunk, CommentUIActions } from '../types';

export function connectComment(docId: string, commentId: string): CommentUIActions {
  return {
    type: UI_CONNECT_COMMENT,
    payload: { docId, commentId },
  };
}

export function connectAnchor(
  docId?: string, commentId?: string, element?: HTMLElement,
): AppThunk<void> {
  return (dispatch) => {
    if (docId == null || commentId == null || element == null) return;
    const anchorId = uuid();
    // eslint-disable-next-line no-param-reassign
    (element as any).anchorId = anchorId;
    dispatch({
      type: UI_CONNECT_ANCHOR,
      payload: {
        docId, commentId, anchorId, element,
      },
    });
  };
}

export function updateComment(docId: string, commentId: string): CommentUIActions {
  return {
    type: UI_SELECT_COMMENT,
    payload: { docId, commentId },
  };
}

export function selectComment(docId: string, commentId: string): CommentUIActions {
  return {
    type: UI_SELECT_COMMENT,
    payload: { docId, commentId },
  };
}

export function selectAnchor(docId?: string, anchor?: HTMLElement | null): AppThunk<void> {
  return (dispatch) => {
    if (docId == null || anchor == null) return;
    const { anchorId } = anchor as any ?? {};
    if (anchorId == null) return;
    dispatch({
      type: UI_SELECT_ANCHOR,
      payload: { docId, anchorId },
    });
  };
}

export function disconnectComment(
  docId?: string, commentId?: string,
): AppThunk<void> {
  return (dispatch) => {
    if (docId == null || commentId == null) return;
    dispatch({
      type: UI_DISCONNECT_COMMENT,
      payload: { docId, commentId },
    });
  };
}
export function disconnectAnchor(
  docId?: string, anchor?: HTMLElement | null,
): AppThunk<void> {
  return (dispatch) => {
    if (docId == null || anchor == null) return;
    const { anchorId } = anchor as any ?? {};
    if (anchorId == null) return;
    dispatch({
      type: UI_DISCONNECT_ANCHOR,
      payload: { docId, anchorId },
    });
  };
}

export function deselectComment(docId: string): CommentUIActions {
  return {
    type: UI_DESELECT_COMMENT,
    payload: { docId },
  };
}
