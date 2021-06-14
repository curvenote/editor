import {
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import {
  wrapIn as wrapInPM,
  setBlockType as setBlockTypePM,
  toggleMark as toggleMarkPM,
  selectParentNode,
} from 'prosemirror-commands';
import { wrapInList as wrapInListPM, liftListItem } from 'prosemirror-schema-list';
import { MarkType, NodeType, Node, Fragment, Schema, NodeRange } from 'prosemirror-model';
import { Nodes, schemas } from '@curvenote/schema';
import { replaceSelectedNode, selectParentNodeOfType, ContentNodeWithPos } from 'prosemirror-utils';
import { liftTarget } from 'prosemirror-transform';
import { dispatchCommentAction } from '../../prosemirror/plugins/comments';
import { AppThunk } from '../types';
import {
  getEditorState,
  getSelectedEditorAndViews,
  getEditorUI,
  selectionIsChildOf,
  getSelectedView,
  getEditorView,
} from '../selectors';
import { focusEditorView, focusSelectedEditorView } from '../ui/actions';
import { applyProsemirrorTransaction } from '../state/actions';
import { getNodeIfSelected } from './utils';
import { createId } from '../../utils';

export function updateNodeAttrs(
  stateKey: any,
  viewId: string | null,
  node: Pick<ContentNodeWithPos, 'node' | 'pos'>,
  attrs: { [index: string]: any },
  select: boolean | 'after' = true,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null) return false;
    const tr = editorState.tr.setNodeMarkup(node.pos, undefined, { ...node.node.attrs, ...attrs });
    if (select === true) tr.setSelection(NodeSelection.create(tr.doc, node.pos));
    if (select === 'after') {
      const sel = TextSelection.create(tr.doc, node.pos + node.node.nodeSize);
      tr.setSelection(sel);
    }
    const result = dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
    if (result && viewId) dispatch(focusEditorView(viewId, true));
    return result;
  };
}

export function deleteNode(
  stateKey: any,
  viewId: string | null,
  node: Pick<ContentNodeWithPos, 'node' | 'pos'>,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null) return false;
    const tr = editorState.tr.delete(node.pos, node.pos + node.node.nodeSize);
    const result = dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
    if (result && viewId) dispatch(focusEditorView(viewId, true));
    return result;
  };
}

export function liftContentOutOfNode(
  stateKey: any,
  viewId: string | null,
  node: Pick<ContentNodeWithPos, 'node' | 'pos'>,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null) return false;
    const $from = editorState.doc.resolve(node.pos + 1);
    const $to = editorState.doc.resolve(node.pos + node.node.nodeSize - 1);
    const range = new NodeRange($from, $to, 1);
    const target = liftTarget(range);
    if (target == null) return false;
    const tr = editorState.tr.lift(range, target);
    const result = dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
    if (result && viewId) dispatch(focusEditorView(viewId, true));
    return result;
  };
}

export function toggleMark(
  stateKey: any,
  viewId: string | null,
  mark?: MarkType,
  attrs?: { [key: string]: any },
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null || !mark) return false;
    const action = toggleMarkPM(mark, attrs);
    const result = action(editorState, (tr: Transaction) =>
      dispatch(applyProsemirrorTransaction(stateKey, viewId, tr)),
    );
    if (result) dispatch(focusEditorView(viewId, true));
    return result;
  };
}

export function removeMark(
  stateKey: any,
  viewId: string | null,
  mark: MarkType,
  from: number,
  to: number,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null || !mark) return false;
    const tr = editorState.tr.removeMark(from, to, mark);
    const result = dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
    if (result) dispatch(focusEditorView(viewId, true));
    return result;
  };
}

export function wrapInList(
  stateKey: string,
  viewId: string | null,
  node: NodeType,
  test = false,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateKey)?.state;
    if (editorState == null) return false;
    const action = selectionIsChildOf(getState(), stateKey, { node }).node
      ? liftListItem(editorState.schema.nodes.list_item)
      : wrapInListPM(node);
    if (test) return action(editorState);
    const result = action(editorState, (tr: Transaction) =>
      dispatch(applyProsemirrorTransaction(stateKey, viewId, tr)),
    );
    if (result) dispatch(focusEditorView(viewId, true));
    return result;
  };
}

export function wrapIn(node: NodeType): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null || !editor.key) return false;
    const isList =
      node === editor.state.schema.nodes.ordered_list ||
      node === editor.state.schema.nodes.bullet_list;
    if (isList) {
      const { viewId } = getEditorUI(getState());
      return dispatch(wrapInList(editor.key, viewId, node));
    }
    const action = wrapInPM(node);
    const result = action(editor.state, (tr: Transaction) =>
      dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr)),
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
    nodeContent = state.schema.text(text);
  }
  return nodeContent;
}

const selectNode = (tr: Transaction, select: boolean | 'after' = true) => {
  if (!select) return tr;
  const nodeSize = tr.selection.$anchor.nodeBefore?.nodeSize ?? 0;
  const resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);
  try {
    return tr.setSelection(new NodeSelection(resolvedPos));
  } catch (error) {
    return tr;
  }
};

export function replaceSelection(
  node: NodeType,
  attrs?: { [index: string]: any },
  content?: Node,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const nodeContent = getContent(editor.state, content);
    const { nodes } = editor.state.schema;
    const selectParagraph = selectParentNodeOfType(nodes.paragraph);
    const replaceWithNode = replaceSelectedNode(node.create(attrs, nodeContent));
    let tr = replaceWithNode(selectParagraph(editor.state.tr));
    if (node.name === nodes.code_block.name) {
      const pos = tr.doc.resolve(tr.selection.from + 1);
      const sel = new Selection(pos, pos);
      tr = tr.setSelection(sel);
    }
    return dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr));
  };
}

function setBlockType(node: NodeType, attrs?: { [index: string]: any }): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const action = setBlockTypePM(node, attrs);
    const result = action(editor.state, (tr: Transaction) =>
      dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr)),
    );
    if (result) dispatch(focusSelectedEditorView(true));
    return result;
  };
}

export function insertNode(
  node: NodeType,
  attrs?: { [index: string]: any },
  content?: Node,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const tr = editor.state.tr
      .insert(editor.state.tr.selection.$from.pos, node.create(attrs, content))
      .scrollIntoView();
    dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, selectNode(tr)));
    return true;
  };
}

export function insertInlineNode(
  node?: NodeType,
  attrs?: { [index: string]: any },
  content?: Node,
  select: boolean | 'after' = true,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null || !node) return false;
    const nodeContent = getContent(editor.state, content);
    const tr = editor.state.tr
      .replaceSelectionWith(node.create(attrs, nodeContent), false)
      .scrollIntoView();
    dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, selectNode(tr, select)));
    // TODO: This should go in a better place, not passing the dom here, should be a better action
    // dispatch(setAttributeEditor(true));
    return true;
  };
}

export function insertText(text: string): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const tr = editor.state.tr.insertText(text);
    dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr));
    return true;
  };
}

export const wrapInHeading = (schema: Schema, level: number) => {
  if (level === 0) return setBlockType(schema.nodes.paragraph);
  return setBlockType(schema.nodes.heading, { level, id: createId() });
};

export const insertVariable = (
  schema: Schema,
  attrs: Nodes.Variable.Attrs = { name: 'myVar', value: '0', valueFunction: '' },
) => replaceSelection(schema.nodes.variable, attrs);

export function addComment(viewId: string, commentId: string): AppThunk<boolean> {
  return (dispatch, getState) => {
    const { view } = getEditorView(getState(), viewId);
    if (!view) return false;
    dispatchCommentAction(view, { type: 'add', commentId });
    return true;
  };
}

export function removeComment(viewId: string, commentId: string): AppThunk<boolean> {
  return (dispatch, getState) => {
    const { view } = getEditorView(getState(), viewId);
    if (!view) return false;
    dispatchCommentAction(view, { type: 'remove', commentId });
    return true;
  };
}

export function addCommentToSelectedView(commentId: string): AppThunk<boolean> {
  return (dispatch, getState) => {
    const { viewId } = getSelectedView(getState());
    if (!viewId) return false;
    dispatch(addComment(viewId, commentId));
    return true;
  };
}

export function toggleCitationBrackets(): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const { schema } = editor.state;
    const node = getNodeIfSelected(editor.state, schemas.nodeNames.cite);
    if (!node) return false;
    const { parent } = editor.state.selection.$from;
    const hasParenthesis = parent.type.name === schema.nodes.cite_group.name;
    if (hasParenthesis) {
      const nodes: Node[] = [];
      parent.forEach((n) => nodes.push(n));
      const frag = Fragment.from(nodes);
      selectParentNode(editor.state, (tr) => {
        const tr2 = tr.deleteSelection().insert(tr.selection.head, frag).scrollIntoView();
        dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr2));
      });
      return true;
    }
    const wrapped = schema.nodes.cite_group.createAndFill({}, Fragment.from([node]));
    if (!wrapped) return false;
    const tr = editor.state.tr.replaceSelectionWith(wrapped).scrollIntoView();
    dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr));
    return true;
  };
}
