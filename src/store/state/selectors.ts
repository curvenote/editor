import { MarkType, NodeType } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import {
  findParentNode, ContentNodeWithPos, isNodeSelection, hasParentNode,
} from 'prosemirror-utils';
// import { SrcId, srcIdToString } from '@iooxa/blocks';
import { EditorView } from 'prosemirror-view';
import { isEditable } from '../../prosemirror/plugins/editable';
import config from '../../config';
import { State } from '../types';

export function getEditor(state: State, stateKey: any | null) {
  if (stateKey == null) return { state: null, views: [] };
  const stateId = config.transformKeyToId(stateKey);
  const editor = state.prosemirror.state.editors[stateId];
  if (!editor) return { state: null, views: [] };
  const views: EditorView[] = [];
  editor.viewIds.forEach((viewId) => {
    const { view } = state.prosemirror.state.views[viewId];
    views.push(view);
  });
  return { state: editor.state, views };
}

export function getEditorState(state: State, stateKey: any | null) {
  if (stateKey == null) return null;
  const stateId = config.transformKeyToId(stateKey);
  const editor = state.prosemirror.state.editors[stateId];
  return editor.state ?? null;
}

export function getUI(state: State) {
  return state.prosemirror.ui;
}

export function isEditorViewFocused(state: State, stateKey: any | null, viewId: string) {
  if (stateKey == null) return null;
  const stateId = config.transformKeyToId(stateKey);
  const { ui } = state.prosemirror;
  return (
    ui.stateId === stateId
    && ui.viewId === viewId
    && ui.focused
  );
}

export function getParentsOfSelection(state: State, stateKey: any | null) {
  /* Can be used to show:

      bullet_list > list_item > paragraph

    using:

      parents.map((parent) => parent.node.type.name)

    Click with:

      dispatch(selectNode(props.srcId, parent.pos))
  */
  if (stateKey == null) return [];
  const editor = getEditor(state, stateKey);
  if (editor.state == null) return [];
  const predicate = () => true;
  const getParent = findParentNode(predicate);
  // state.selection.$anchor.start();
  const parents: ContentNodeWithPos[] = [];
  if (isNodeSelection(editor.state.selection)) {
    const {
      depth, pos, nodeAfter,
    } = editor.state.selection.$from;
    parents.push({
      pos,
      start: pos,
      depth,
      node: nodeAfter ?? editor.state.doc.resolve(pos + 1).node(),
    });
  }
  let parent = getParent(editor.state.selection);
  while (parent !== undefined) {
    parents.push(parent);
    parent = getParent(NodeSelection.create(editor.state.doc, parent.pos));
  }
  return parents.reverse();
}

export function getNodeAttrs(state: State, stateId: any | null, pos: number) {
  if (stateId == null) return null;
  const editor = getEditor(state, stateId);
  if (editor.state == null) return null;
  const out = editor.state.doc.resolve(pos);
  const node = out.nodeAfter ?? out.parent;
  return node.attrs;
}

export function menuActive(state: State, stateId: any | null) {
  const editor = getEditor(state, stateId);
  if (editor.state == null) return false;
  return isEditable(editor.state);
}

function falseMap<T extends {}>(obj: Record<keyof T, any>): Record<keyof T, boolean> {
  return Object.fromEntries(
    Object.entries(obj).map(([key]) => [key, false]),
  ) as Record<keyof T, boolean>;
}

export function selectionIsMarkedWith<T extends {}>(
  state: State, stateKey: any | null, types: Record<keyof T, MarkType>,
): Record<keyof T, boolean> {
  const editor = getEditor(state, stateKey);
  if (editor.state == null) return falseMap(types);
  const {
    from, $from, to, empty,
  } = editor.state.selection;
  const active = Object.fromEntries(Object.entries(types).map(([key, type]) => {
    const mark = type as MarkType;
    if (empty) return [key, Boolean(mark.isInSet(editor.state.storedMarks || $from.marks()))];
    return [key, editor.state.doc.rangeHasMark(from, to, mark)];
  }));
  return active as Record<keyof T, boolean>;
}

export function selectionIsChildOf<T extends {}>(
  state: State, stateKey: any | null, nodes: Record<keyof T, NodeType>,
): Record<keyof T, boolean> {
  const editor = getEditor(state, stateKey);
  if (editor.state == null) return falseMap(nodes);
  const active = Object.fromEntries(Object.entries(nodes).map(([key, type]) => {
    const node = type as NodeType;
    return [key, hasParentNode((test) => test.type === node)(editor.state.selection)];
  }));
  return active as Record<keyof T, boolean>;
}
