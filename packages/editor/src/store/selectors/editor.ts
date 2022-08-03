import { MarkType, NodeType } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import { findParentNode, isNodeSelection, hasParentNode } from 'prosemirror-utils1';
import type { ContentNodeWithPos } from 'prosemirror-utils1';
import { nodeNames } from '@curvenote/schema';
import { createSelector } from '@reduxjs/toolkit';
import { getNodeIfSelected } from '../ui/utils';
import { isEditable } from '../../prosemirror/plugins/editable';
import { selectEditorState } from '../state/selectors';
import { State } from '../types';
import { getEditorUI } from '../ui/selectors';

const predicate = () => true;
export const getParentsOfSelection = createSelector(
  [selectEditorState, (_: State, stateKey: string | null) => stateKey],
  (editor, stateKey) => {
    if (!editor || !stateKey) return [];
    if (editor.state == null) return [];
    const getParent = findParentNode(predicate);
    const parents: ContentNodeWithPos[] = [];
    if (isNodeSelection(editor.state.selection)) {
      const { depth, pos, nodeAfter } = editor.state.selection.$from;
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
  },
);

export const getNodeAttrs = createSelector(
  [selectEditorState, (_: State, stateKey: string | null, pos: number) => pos],
  (editor, pos) => {
    if (editor.state == null) return null;
    const out = editor.state.doc.resolve(pos);
    const node = out.nodeAfter ?? out.parent;
    return node.attrs;
  },
);

export const menuActive = createSelector([selectEditorState], (editor) => {
  if (editor.state == null) return false;
  return isEditable(editor.state);
});

function falseMap<T extends Record<string, any>>(
  obj: Record<keyof T, any>,
): Record<keyof T, boolean> {
  return Object.fromEntries(Object.entries(obj).map(([key]) => [key, false])) as Record<
    keyof T,
    boolean
  >;
}

function makeSelectionIsMarkedWith<T extends Record<string, any>>() {
  return createSelector(
    [
      selectEditorState,
      (_: State, stateKey: string | null, types: Record<keyof T, MarkType | undefined>) => types,
    ],
    (editor, types) => {
      const { state: editorState } = editor;
      if (editorState == null) return falseMap(types);
      const { from, $from, to, empty } = editorState.selection;
      const active = Object.fromEntries(
        Object.entries(types).map(([key, type]) => {
          const mark = type as MarkType | undefined;
          if (!mark) return [key, false];
          if (empty) return [key, Boolean(mark.isInSet(editorState.storedMarks || $from.marks()))];
          return [key, editorState.doc.rangeHasMark(from, to, mark)];
        }),
      );
      return active as Record<keyof T, boolean>;
    },
  );
}

export const selectionIsMarkedWith = makeSelectionIsMarkedWith();

function makeSelectSelectionIsChildOf<T extends Record<string, any>>() {
  return createSelector(
    [
      selectEditorState,
      (_: State, stateKey: string | null, nodes: Record<keyof T, NodeType | undefined>) => nodes,
    ],
    (editor, nodes) => {
      const { state: editorState } = editor;
      if (editorState == null) return falseMap(nodes);
      const active = Object.fromEntries(
        Object.entries(nodes).map(([key, type]) => {
          const node = type as NodeType | undefined;
          if (!node) return [key, false];
          return [key, hasParentNode((test) => test.type === node)(editorState.selection)];
        }),
      );
      return active as Record<keyof T, boolean>;
    },
  );
}
export const selectionIsChildOf = makeSelectSelectionIsChildOf();

export function selectionIsChildOfActiveState<T extends Record<string, any>>(
  state: State,
  nodes: Record<keyof T, NodeType | undefined>,
) {
  const { stateId } = getEditorUI(state);
  return selectionIsChildOf(state, stateId, nodes);
}

function makeSelectSelectionIsThisNodeType<T extends Record<string, any>>() {
  return createSelector(
    [
      selectEditorState,
      (_: State, stateKey: string | null, nodes: Record<keyof T, NodeType | undefined>) => nodes,
    ],
    (editor, nodes) => {
      if (editor.state == null) return falseMap(nodes);
      const active = Object.fromEntries(
        Object.entries(nodes).map(([key, type]) => {
          const node = type as NodeType | undefined;
          if (!node) return [key, false];
          return [key, Boolean(getNodeIfSelected(editor.state, node.name as nodeNames))];
        }),
      );
      return active as Record<keyof T, boolean>;
    },
  );
}

export const selectionIsThisNodeType = makeSelectSelectionIsThisNodeType();
