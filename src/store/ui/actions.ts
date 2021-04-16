import { v4 as uuid } from 'uuid';
import {
  UI_CONNECT_ANCHOR, UI_DESELECT_SIDENOTE, UI_DISCONNECT_ANCHOR,
  UI_CONNECT_SIDENOTE, UI_SELECT_ANCHOR, UI_SELECT_SIDENOTE,
  UI_DISCONNECT_SIDENOTE, UI_CONNECT_ANCHOR_BASE,
  UI_REPOSITION_SIDENOTES, UI_RESET_ALL_SIDENOTES,
} from './types';
import { AppThunk, SidenotesUIActions } from '../types';

export function connectSidenote(
  docId?: string, sidenoteId?: string, baseId?: string,
): AppThunk<void> {
  return (dispatch) => {
    if (docId == null || sidenoteId == null) return;
    dispatch({
      type: UI_CONNECT_SIDENOTE,
      payload: { docId, sidenoteId, baseId },
    } as SidenotesUIActions);
  };
}

export function connectAnchor(
  docId?: string, sidenoteId?: string, element?: HTMLElement,
): AppThunk<void> {
  return (dispatch) => {
    if (docId == null || sidenoteId == null || element == null) return;
    const anchorId = uuid();
    // eslint-disable-next-line no-param-reassign
    (element as any).anchorId = anchorId;
    dispatch({
      type: UI_CONNECT_ANCHOR,
      payload: {
        docId, sidenoteId, anchorId, element,
      },
    } as SidenotesUIActions);
  };
}

export function connectAnchorBase(
  docId?: string, anchorId?: string, element?: HTMLElement,
): AppThunk<void> {
  return (dispatch) => {
    if (docId == null || anchorId == null || element == null) return;
    // eslint-disable-next-line no-param-reassign
    (element as any).anchorId = anchorId;
    dispatch({
      type: UI_CONNECT_ANCHOR_BASE,
      payload: {
        docId, anchorId, element,
      },
    } as SidenotesUIActions);
  };
}

export function updateSidenote(docId: string, sidenoteId: string): SidenotesUIActions {
  return {
    type: UI_SELECT_SIDENOTE,
    payload: { docId, sidenoteId },
  };
}

export function selectSidenote(docId?: string, sidenoteId?: string): AppThunk<void> {
  return (dispatch) => {
    dispatch({
      type: UI_SELECT_SIDENOTE,
      payload: { docId, sidenoteId },
    } as SidenotesUIActions);
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
    } as SidenotesUIActions);
  };
}

export function disconnectSidenote(
  docId?: string, sidenoteId?: string,
): AppThunk<void> {
  return (dispatch) => {
    if (docId == null || sidenoteId == null) return;
    dispatch({
      type: UI_DISCONNECT_SIDENOTE,
      payload: { docId, sidenoteId },
    } as SidenotesUIActions);
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
    } as SidenotesUIActions);
  };
}

export function resetAllSidenotes(): AppThunk<void> {
  return (dispatch) => {
    dispatch({
      type: UI_RESET_ALL_SIDENOTES,
      payload: {},
    } as SidenotesUIActions);
  };
}

export function deselectSidenote(docId: string): SidenotesUIActions {
  return {
    type: UI_DESELECT_SIDENOTE,
    payload: { docId },
  };
}

export function repositionSidenotes(docId: string): SidenotesUIActions {
  return {
    type: UI_REPOSITION_SIDENOTES,
    payload: { docId },
  };
}
