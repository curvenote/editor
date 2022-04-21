import { EditorState, NodeSelection, Transaction } from 'prosemirror-state';
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
  RESET_EDITOR_AND_VIEWS,
} from './types';
import { AppThunk } from '../types';
import { getEditorState, getEditorView } from './selectors';
import { opts } from '../../connect';
import { LinkType } from '../../components/types';
import { getLinkBoundsIfTheyExist } from '../actions/utils';

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
  tr?: Transaction,
): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  const counts = tr?.docChanged ? process.countState(editorState) : null;
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
  focus = false,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const { view } = getEditorView(getState(), viewId);
    if (view) {
      view.dispatch(tr);
      if (focus) view.focus();
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

export function resetEditorAndViews(stateKey: any): EditorActionTypes {
  const stateId = opts.transformKeyToId(stateKey);
  if (stateId == null) throw new Error('Must have a state ID');
  return {
    type: RESET_EDITOR_AND_VIEWS,
    payload: {
      stateId,
    },
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
    const selection = state?.doc ? NodeSelection.create(state.doc, state.selection.from) : null;
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
