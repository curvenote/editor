import { PopperPlacementType } from '@material-ui/core';
import { NodeSelection } from 'prosemirror-state';
import { LinkType } from '../../components/types';
import {
  SELECT_EDITOR_VIEW,
  InlineSelection,
  UIActionTypes,
  INLINE_SELECTION,
  SelectionKinds,
} from './types';
import { AppThunk } from '../types';
import { getEditorUI, getInlineActionKind, getSelectedEditorAndViews } from './selectors';
import { getEditorState, getEditorView } from '../state/selectors';
import { getSelectionKind } from './utils';
import { applyProsemirrorTransaction, getLinkBoundsIfTheyExist } from '../actions';

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

export function switchLinkType({
  linkType,
  stateId,
  viewId,
  url,
}: {
  linkType: LinkType;
  stateId: string;
  viewId: string;
  url: string;
}): AppThunk<void> {
  return (dispatch, getState) => {
    const state = getEditorState(getState(), stateId)?.state;
    if (!state) return;
    const {
      selection: { from },
    } = state;
    const selection =
      state?.doc && state.selection.$head.nodeAfter // guarding nodeAfter prop seem to fix a run time exception
        ? NodeSelection.create(state.doc, state.selection.from)
        : null;
    const node = selection?.node;
    if (!selection || !node) return;

    if (linkType === 'link') {
      const mark = state?.schema.marks.link;
      const link = mark.create({ href: url });
      const tr = state.tr.replaceRangeWith(
        from,
        from + node.nodeSize,
        state.schema.text(url, [link]),
      );
      dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
    } else if (linkType === 'link-block') {
      const linkBounds = getLinkBoundsIfTheyExist(state);
      if (!linkBounds) return;
      const newNode = state.schema.nodes.link_block.createAndFill({
        title: '',
        description: '',
        url,
      }) as any;
      const tr = state.tr.replaceRangeWith(linkBounds.from, linkBounds.to, newNode);
      dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
    }
  };
}
