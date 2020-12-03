import { EditorState, NodeSelection, Transaction } from 'prosemirror-state';
import { wrapIn as wrapInPM, setBlockType as setBlockTypePM, toggleMark as toggleMarkPM } from 'prosemirror-commands';
import { wrapInList as wrapInListPM, liftListItem } from 'prosemirror-schema-list';
import { MarkType, NodeType, Node } from 'prosemirror-model';
import { Nodes } from '@iooxa/schema';
import { replaceSelectedNode, selectParentNodeOfType, ContentNodeWithPos } from 'prosemirror-utils';
import { AppThunk } from '../types';
import {
  getEditorState, getSelectedEditorAndViews, getEditorUI, selectionIsChildOf,
} from '../selectors';
import schema from '../../prosemirror/schema';
import { focusEditorView, focusSelectedEditorView } from '../ui/actions';
import { applyProsemirrorTransaction } from '../state/actions';


export function updateNodeAttrs(
  stateKey: any, viewId: string | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>, attrs: { [index: string]: any },
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null) return false;
    const tr = editorState.tr.setNodeMarkup(
      node.pos,
      undefined,
      { ...node.node.attrs, ...attrs },
    );
    tr.setSelection(NodeSelection.create(tr.doc, node.pos));
    const result = dispatch(applyProsemirrorTransaction(stateKey, tr));
    if (result && viewId) dispatch(focusEditorView(viewId, true));
    return result;
  };
}


export function toggleMark(
  stateKey: any, viewId: string | null, mark: MarkType, attrs?: {[key: string]: any},
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null) return false;
    const action = toggleMarkPM(mark, attrs);
    const result = action(
      editorState,
      (tr: Transaction) => dispatch(applyProsemirrorTransaction(stateKey, tr)),
    );
    if (result) dispatch(focusEditorView(viewId, true));
    return result;
  };
}

export function wrapInList(
  stateKey: string, viewId: string | null, node: NodeType, test = false,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null) return false;
    const action = selectionIsChildOf(getState(), stateKey, { node }).node
      ? liftListItem(schema.nodes.list_item)
      : wrapInListPM(node);
    if (test) return action(editorState);
    const result = action(
      editorState,
      (tr: Transaction) => dispatch(applyProsemirrorTransaction(stateKey, tr)),
    );
    if (result) dispatch(focusEditorView(viewId, true));
    return result;
  };
}

export function wrapIn(node: NodeType): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const isList = (
      node === schema.nodes.ordered_list
      || node === schema.nodes.bullet_list
    );
    if (isList) {
      const { viewId } = getEditorUI(getState());
      return dispatch(wrapInList(editor.stateId, viewId, node));
    }
    const action = wrapInPM(node);
    const result = action(
      editor.state,
      (tr: Transaction) => dispatch(applyProsemirrorTransaction(editor.stateId, tr)),
    );
    if (result) dispatch(focusSelectedEditorView(true));
    return result;
  };
}


function getContent(state: EditorState, content?: Node) {
  let nodeContent = content;
  if (!nodeContent && !state.selection.empty) {
    const { from, to } = state.selection;
    const text = state.doc.textBetween(from, to);
    nodeContent = schema.text(text);
  }
  return nodeContent;
}

const selectNode = (tr: Transaction) => {
  const nodeSize = tr.selection.$anchor.nodeBefore?.nodeSize ?? 0;
  const resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);
  try {
    return tr.setSelection(new NodeSelection(resolvedPos));
  } catch (error) {
    return tr;
  }
};


export function replaceSelection(
  node: NodeType, attrs?: { [index: string]: any }, content?: Node,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const nodeContent = getContent(editor.state, content);
    const selectParagraph = selectParentNodeOfType(schema.nodes.paragraph);
    const replaceWithNode = replaceSelectedNode(node.create(attrs, nodeContent));
    const tr = replaceWithNode(selectParagraph(editor.state.tr));
    return dispatch(applyProsemirrorTransaction(editor.stateId, tr));
  };
}

function setBlockType(node: NodeType, attrs?: {[index: string]: any}): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const action = setBlockTypePM(node, attrs);
    const result = action(
      editor.state,
      (tr: Transaction) => dispatch(applyProsemirrorTransaction(editor.stateId, tr)),
    );
    if (result) dispatch(focusSelectedEditorView(true));
    return result;
  };
}

export function insertNode(
  node: NodeType, attrs?: { [index: string]: any }, content?: Node,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const tr = editor.state.tr.insert(
      editor.state.tr.selection.$from.pos, node.create(attrs, content),
    ).scrollIntoView();
    dispatch(applyProsemirrorTransaction(editor.stateId, tr));
    return true;
  };
}

export function insertInlineNode(
  node: NodeType, attrs?: { [index: string]: any }, content?: Node,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const nodeContent = getContent(editor.state, content);
    const tr = editor.state.tr.replaceSelectionWith(
      node.create(attrs, nodeContent), false,
    ).scrollIntoView();
    dispatch(applyProsemirrorTransaction(editor.stateId, selectNode(tr)));
    // TODO: This should go in a better place, not passing the dom here, should be a better action
    // dispatch(setAttributeEditor(true));
    return true;
  };
}

export const wrapInHeading = (level: number) => {
  if (level === 0) return setBlockType(schema.nodes.paragraph);
  return setBlockType(schema.nodes.heading, { level });
};

export const insertVariable = (
  attrs: Nodes.Variable.Attrs = { name: 'myVar', value: '0', valueFunction: '' },
) => (
  replaceSelection(schema.nodes.variable, attrs)
);
