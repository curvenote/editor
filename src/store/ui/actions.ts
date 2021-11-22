import { PopperPlacementType } from '@material-ui/core';
import {
  SELECT_EDITOR_VIEW,
  FOCUS_EDITOR_VIEW,
  InlineSelection,
  UIActionTypes,
  INLINE_SELECTION,
  SelectionKinds,
} from './types';
import { AppThunk } from '../types';
import { getEditorUI, getSelectedEditorAndViews, isInlineActionOpen } from './selectors';
import { getEditorView } from '../state/selectors';
import { getSelectionKind } from './utils';

export function selectEditorView(viewId: string | null): AppThunk<void> {
  return (dispatch, getState) => {
    const { stateId } = getEditorView(getState(), viewId);
    dispatch({
      type: SELECT_EDITOR_VIEW,
      payload: { stateId, viewId },
    });
  };
}

export function focusEditorView(viewId: string | null, focused: boolean): AppThunk<void> {
  return (dispatch, getState) => {
    const { stateId } = getEditorView(getState(), viewId);
    dispatch({
      type: FOCUS_EDITOR_VIEW,
      payload: { stateId, viewId, focused },
    });
  };
}

export function focusSelectedEditorView(focused: boolean): AppThunk<void> {
  return (dispatch, getState) => {
    const { viewId } = getEditorUI(getState());
    dispatch(focusEditorView(viewId, focused));
  };
}

export function setInlineSelection(selection: InlineSelection | null): UIActionTypes {
  return {
    type: INLINE_SELECTION,
    payload: selection,
  };
}

export function positionInlineActions(): AppThunk<void> {
  return (dispatch, getState) => {
    const { viewId, view, state } = getSelectedEditorAndViews(getState());
    const currentSelectionOpen = isInlineActionOpen(getState());
    const selection = getSelectionKind(state);
    if (viewId == null || state == null || view == null || !selection) {
      if (currentSelectionOpen) dispatch(setInlineSelection(null));
      return;
    }
    const placement = {
      anchorEl: view.nodeDOM(selection.pos) as Element | HTMLElement | null | undefined,
      placement: 'bottom-start' as PopperPlacementType,
    };
    const getAnchorEl = (tag: string, container = false) => {
      const { anchorEl } = placement;
      // If container is true, look for the tag name first
      if (container) return anchorEl?.getElementsByTagName?.(tag)[0] ?? anchorEl;
      // Otherwise look to `ProseMirror-node` as a class
      return (
        anchorEl?.getElementsByClassName('ProseMirror-node')[0] ??
        anchorEl?.getElementsByTagName?.(tag)[0] ??
        anchorEl
      );
    };
    switch (selection.kind) {
      case SelectionKinds.link:
        placement.anchorEl = view.nodeDOM(selection.pos)?.parentElement;
        break;
      case SelectionKinds.image:
        placement.anchorEl = getAnchorEl('img');
        placement.placement = 'bottom';
        break;
      case SelectionKinds.iframe:
        placement.anchorEl = getAnchorEl('iframe');
        placement.placement = 'bottom';
        break;
      case SelectionKinds.table:
        // Note: we are always looking for the table in this case
        placement.anchorEl = getAnchorEl('table', true);
        placement.placement = 'bottom';
        break;
      case SelectionKinds.figure:
      case SelectionKinds.callout:
      case SelectionKinds.code:
        placement.placement = 'bottom';
        break;
      case SelectionKinds.equation:
        placement.placement = 'right';
        break;
      default:
        break;
    }
    dispatch(setInlineSelection({ ...selection, ...placement }));
  };
}
