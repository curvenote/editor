import type { PopperPlacementType } from '@material-ui/core';
import type { InlineSelection, UIActionTypes } from './types';
import { SELECT_EDITOR_VIEW, INLINE_SELECTION, SelectionKinds } from './types';
import type { AppThunk } from '../types';
import { getEditorUI, getInlineActionKind, getSelectedEditorAndViews } from './selectors';
import { getEditorView } from '../state/selectors';
import { getSelectionKind } from './utils';

export function updateSelectView(viewId: string | null): AppThunk<void> {
  return (dispatch, getState) => {
    const { stateId } = getEditorView(getState(), viewId);
    dispatch({
      type: SELECT_EDITOR_VIEW,
      payload: { stateId, viewId },
    });
  };
}

/**
 * @deprecated use updateSelectView
 */
export const selectEditorView = updateSelectView;

export function focusEditorView(viewId: string | null, focused: boolean): AppThunk<void> {
  return (dispatch, getState) => {
    const { view } = getEditorView(getState(), viewId);
    if (!view) return;
    if (focused) {
      view.focus();
    } else {
      (view.dom as HTMLElement).blur();
    }
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
    const selection = getSelectionKind(state);
    if (viewId == null || state == null || view == null || !selection) {
      const open = getInlineActionKind(getState());
      if (open) dispatch(setInlineSelection(null));
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
      case SelectionKinds.link_block:
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
