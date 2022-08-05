import type { Attrs, Mark, Node, NodeType } from 'prosemirror-model';
import type { Transaction } from 'prosemirror-state';
import { NodeSelection } from 'prosemirror-state';
import { Fragment } from 'prosemirror-model';
import { findParentNodeOfType, findPositionOfNodeBefore } from './selection';
import {
  cloneTr,
  isNodeSelection,
  replaceNodeAtPos,
  removeNodeAtPos,
  canInsert,
  isEmptyParagraph,
  setTextSelection,
} from './helpers';

// :: (nodeType: union<NodeType, [NodeType]>) → (tr: Transaction) → Transaction
// Returns a new transaction that removes a node of a given `nodeType`. It will return an original transaction if parent node hasn't been found.
//
// ```javascript
// dispatch(
//   removeParentNodeOfType(schema.nodes.table)(tr)
// );
// ```
export const removeParentNodeOfType = (nodeType: NodeType) => (tr: Transaction) => {
  const parent = findParentNodeOfType(nodeType)(tr.selection);
  if (parent) {
    return removeNodeAtPos(parent.pos)(tr);
  }
  return tr;
};

// :: (nodeType: union<NodeType, [NodeType]>, content: union<ProseMirrorNode, Fragment>) → (tr: Transaction) → Transaction
// Returns a new transaction that replaces parent node of a given `nodeType` with the given `content`. It will return an original transaction if either parent node hasn't been found or replacing is not possible.
//
// ```javascript
// const node = schema.nodes.paragraph.createChecked({}, schema.text('new'));
//
// dispatch(
//  replaceParentNodeOfType(schema.nodes.table, node)(tr)
// );
// ```
export const replaceParentNodeOfType =
  (nodeType: NodeType | NodeType[], content: Node | Fragment) => (tr: Transaction) => {
    if (!Array.isArray(nodeType)) {
      nodeType = [nodeType];
    }
    for (let i = 0, count = nodeType.length; i < count; i += 1) {
      const parent = findParentNodeOfType(nodeType[i])(tr.selection);
      if (parent) {
        const newTr = replaceNodeAtPos(parent.pos, content)(tr);
        if (newTr !== tr) {
          return newTr;
        }
      }
    }
    return tr;
  };

// :: (tr: Transaction) → Transaction
// Returns a new transaction that removes selected node. It will return an original transaction if current selection is not a `NodeSelection`.
//
// ```javascript
// dispatch(
//   removeSelectedNode(tr)
// );
// ```
export const removeSelectedNode = (tr: Transaction) => {
  if (isNodeSelection(tr.selection)) {
    const from = tr.selection.$from.pos;
    const to = tr.selection.$to.pos;
    return cloneTr(tr.delete(from, to));
  }
  return tr;
};

// :: (content: union<ProseMirrorNode, ProseMirrorFragment>) → (tr: Transaction) → Transaction
// Returns a new transaction that replaces selected node with a given `node`, keeping NodeSelection on the new `node`.
// It will return the original transaction if either current selection is not a NodeSelection or replacing is not possible.
//
// ```javascript
// const node = schema.nodes.paragraph.createChecked({}, schema.text('new'));
// dispatch(
//   replaceSelectedNode(node)(tr)
// );
// ```
export const replaceSelectedNode = (content: Node | Fragment) => (tr: Transaction) => {
  if (isNodeSelection(tr.selection)) {
    const { $from, $to } = tr.selection;
    if (
      (content instanceof Fragment &&
        $from.parent.canReplace($from.index(), $from.indexAfter(), content)) ||
      $from.parent.canReplaceWith($from.index(), $from.indexAfter(), (content as Node).type)
    ) {
      return cloneTr(
        tr
          .replaceWith($from.pos, $to.pos, content)
          // restore node selection
          .setSelection(new NodeSelection(tr.doc.resolve($from.pos))),
      );
    }
  }
  return tr;
};

const isSelectableNode = (node: Node | Fragment): node is Node =>
  ('type' in node && node.type.spec.selectable) ?? false;
const shouldSelectNode = (node: Node | Fragment) => isSelectableNode(node) && node.type.isLeaf;

const setSelection = (node: Node | Fragment, pos: number, tr: Transaction) => {
  if (shouldSelectNode(node)) {
    return tr.setSelection(new NodeSelection(tr.doc.resolve(pos)));
  }
  return setTextSelection(pos)(tr);
};

// :: (content: union<ProseMirrorNode, Fragment>, position: ?number, tryToReplace?: boolean) → (tr: Transaction) → Transaction
// Returns a new transaction that inserts a given `content` at the current cursor position, or at a given `position`, if it is allowed by schema. If schema restricts such nesting, it will try to find an appropriate place for a given node in the document, looping through parent nodes up until the root document node.
// If `tryToReplace` is true and current selection is a NodeSelection, it will replace selected node with inserted content if its allowed by schema.
// If cursor is inside of an empty paragraph, it will try to replace that paragraph with the given content. If insertion is successful and inserted node has content, it will set cursor inside of that content.
// It will return an original transaction if the place for insertion hasn't been found.
//
// ```javascript
// const node = schema.nodes.extension.createChecked({});
// dispatch(
//   safeInsert(node)(tr)
// );
// ```
export const safeInsert =
  (content: Node | Fragment, position?: number, tryToReplace?: boolean) => (tr: Transaction) => {
    const hasPosition = typeof position === 'number';
    const { $from } = tr.selection;
    const $insertPos = hasPosition
      ? tr.doc.resolve(position)
      : isNodeSelection(tr.selection)
      ? tr.doc.resolve($from.pos + 1)
      : $from;
    const { parent } = $insertPos;

    // try to replace selected node
    if (isNodeSelection(tr.selection) && tryToReplace) {
      const oldTr = tr;
      tr = replaceSelectedNode(content)(tr);
      if (oldTr !== tr) {
        return tr;
      }
    }

    // try to replace an empty paragraph
    if (isEmptyParagraph(parent)) {
      const oldTr = tr;
      tr = replaceParentNodeOfType(parent.type, content)(tr);
      if (oldTr !== tr) {
        const pos = isSelectableNode(content)
          ? // for selectable node, selection position would be the position of the replaced parent
            $insertPos.before($insertPos.depth)
          : $insertPos.pos;
        return setSelection(content, pos, tr);
      }
    }

    // given node is allowed at the current cursor position
    if (canInsert($insertPos, content)) {
      tr.insert($insertPos.pos, content);
      const pos = hasPosition
        ? $insertPos.pos
        : isSelectableNode(content)
        ? // for atom nodes selection position after insertion is the previous pos
          tr.selection.$anchor.pos - 1
        : tr.selection.$anchor.pos;
      return cloneTr(setSelection(content, pos, tr));
    }

    // looking for a place in the doc where the node is allowed
    for (let i = $insertPos.depth; i > 0; i -= 1) {
      const pos = $insertPos.after(i);
      const $pos = tr.doc.resolve(pos);
      if (canInsert($pos, content)) {
        tr.insert(pos, content);
        return cloneTr(setSelection(content, pos, tr));
      }
    }
    return tr;
  };

// :: (nodeType: union<NodeType, [NodeType]>, type: ?union<NodeType, null>, attrs: ?union<Object, null>, marks?: [Mark]) → (tr: Transaction) → Transaction
// Returns a transaction that changes the type, attributes, and/or marks of the parent node of a given `nodeType`.
//
// ```javascript
// const node = schema.nodes.extension.createChecked({});
// dispatch(
//   setParentNodeMarkup(schema.nodes.panel, null, { panelType })(tr);
// );
// ```
export const setParentNodeMarkup =
  (nodeType: NodeType | NodeType[], type: NodeType | null, attrs?: Attrs | null, marks?: Mark[]) =>
  (tr: Transaction) => {
    const parent = findParentNodeOfType(nodeType)(tr.selection);
    if (parent) {
      return cloneTr(tr.setNodeMarkup(parent.pos, type, { ...parent.node.attrs, ...attrs }, marks));
    }
    return tr;
  };

// :: (nodeType: union<NodeType, [NodeType]>) → (tr: Transaction) → Transaction
// Returns a new transaction that sets a `NodeSelection` on a parent node of a `given nodeType`.
//
// ```javascript
// dispatch(
//   selectParentNodeOfType([tableCell, tableHeader])(state.tr)
// );
// ```
export const selectParentNodeOfType = (nodeType: NodeType | NodeType[]) => (tr: Transaction) => {
  if (!isNodeSelection(tr.selection)) {
    const parent = findParentNodeOfType(nodeType)(tr.selection);
    if (parent) {
      return cloneTr(tr.setSelection(NodeSelection.create(tr.doc, parent.pos)));
    }
  }
  return tr;
};

// :: (tr: Transaction) → Transaction
// Returns a new transaction that deletes previous node.
//
// ```javascript
// dispatch(
//   removeNodeBefore(state.tr)
// );
// ```
export const removeNodeBefore = (tr: Transaction) => {
  const position = findPositionOfNodeBefore(tr.selection);
  if (typeof position === 'number') {
    return removeNodeAtPos(position)(tr);
  }
  return tr;
};
