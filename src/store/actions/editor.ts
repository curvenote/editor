import { NodeSelection, Transaction } from 'prosemirror-state';
import { wrapIn as wrapInPM, setBlockType as setBlockTypePM, toggleMark as toggleMarkPM } from 'prosemirror-commands';
import { wrapInList as wrapInListPM, liftListItem } from 'prosemirror-schema-list';
import { MarkType, NodeType, Node } from 'prosemirror-model';
import { Nodes } from '@iooxa/schema';
import { AppThunk } from '../types';
import {
  getEditorState, getSelectedEditorAndViews, getEditorUI, selectionIsChildOf,
} from '../selectors';
import schema from '../../prosemirror/schema';
import { focusEditorView, focusSelectedEditorView } from '../ui/actions';
import { applyProsemirrorTransaction } from '../state/actions';


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

function wrapIn(node: NodeType, list = false): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    if (list) {
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


function replaceSelection(node: Node): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const { tr } = editor.state;
    dispatch(applyProsemirrorTransaction(
      editor.stateId,
      tr.replaceSelectionWith(node).scrollIntoView(),
    ));
    return true;
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

function insertNode(
  node: NodeType, attrs?: { [index: string]: any }, content?: Node,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const tr = editor.state.tr.insert(
      editor.state.tr.selection.$from.pos, node.create(attrs, content),
    ).scrollIntoView();
    // TODO: This leave the paragraph empty, and does not select
    dispatch(applyProsemirrorTransaction(editor.stateId, tr));
    return true;
  };
}


function insertInlineNode(
  node: NodeType, attrs?: { [index: string]: any }, content?: Node,
): AppThunk<boolean> {
  return (dispatch, getState) => {
    const editor = getSelectedEditorAndViews(getState());
    if (editor.state == null) return false;
    const tr = editor.state.tr.replaceSelectionWith(
      node.create(attrs, content), false,
    ).scrollIntoView();
    const nodeSize = tr.selection.$anchor.nodeBefore?.nodeSize ?? 0;
    const resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);
    const selected = tr.setSelection(new NodeSelection(resolvedPos));
    dispatch(applyProsemirrorTransaction(editor.stateId, selected));
    // TODO: This should go in a better place, not passing the dom here, should be a better action
    // dispatch(setAttributeEditor(true));
    return true;
  };
}

export const wrapInCallout = () => wrapIn(schema.nodes.callout);
export const wrapInAside = () => wrapIn(schema.nodes.aside);

export const wrapInOrderedList = () => wrapIn(schema.nodes.ordered_list, true);
export const wrapInBulletList = () => wrapIn(schema.nodes.bullet_list, true);
export const insertHorizontalRule = () => (
  replaceSelection(schema.nodes.horizontal_rule.create())
);
export const wrapInHeading = (level: number) => setBlockType(schema.nodes.heading, { level });
export const insertMath = () => insertNode(schema.nodes.math);

export const insertVariable = (
  attrs: Nodes.Variable.Attrs = { name: 'myVar', value: '0', valueFunction: '' },
) => (
  insertNode(schema.nodes.variable, attrs)
);
export const insertDisplay = (attrs?: Nodes.Display.Attrs) => (
  insertInlineNode(schema.nodes.display, attrs)
);
export const insertRange = (attrs: Nodes.Range.Attrs) => (
  insertInlineNode(schema.nodes.range, attrs)
);
export const insertDynamic = (attrs: Nodes.Dynamic.Attrs) => (
  insertInlineNode(schema.nodes.dynamic, attrs)
);
export const insertSwitch = (attrs: Nodes.Switch.Attrs) => (
  insertInlineNode(schema.nodes.switch, attrs)
);
export const insertButton = (attrs: Nodes.Button.Attrs) => (
  insertInlineNode(schema.nodes.button, attrs)
);
