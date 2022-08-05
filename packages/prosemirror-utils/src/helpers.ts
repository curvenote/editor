import type { Transaction } from 'prosemirror-state';
import { NodeSelection, Selection } from 'prosemirror-state';
import type { NodeType, ResolvedPos } from 'prosemirror-model';
import { Fragment, Node } from 'prosemirror-model';
import type { Predicate } from './types';

// :: ($pos: ResolvedPos, predicate: (node: ProseMirrorNode) → boolean) → ?{pos: number, start: number, depth: number, node: ProseMirrorNode}
// Iterates over parent nodes starting from the given `$pos`, returning the closest node and its start position `predicate` returns truthy for. `start` points to the start position of the node, `pos` points directly before the node.
//
// ```javascript
// const predicate = node => node.type === schema.nodes.blockquote;
// const parent = findParentNodeClosestToPos(state.doc.resolve(5), predicate);
// ```
export const findParentNodeClosestToPos = ($pos: ResolvedPos, predicate: Predicate) => {
  for (let i = $pos.depth; i > 0; i += -1) {
    const node = $pos.node(i);
    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node,
      };
    }
  }
  return undefined;
};

// :: (position: number, dir: ?number) → (tr: Transaction) → Transaction
// Returns a new transaction that tries to find a valid cursor selection starting at the given `position`
// and searching back if `dir` is negative, and forward if positive.
// If a valid cursor position hasn't been found, it will return the original transaction.
//
// ```javascript
// dispatch(
//   setTextSelection(5)(tr)
// );
// ```
export const setTextSelection =
  (position: number, dir = 1) =>
  (tr: Transaction) => {
    const nextSelection = Selection.findFrom(tr.doc.resolve(position), dir, true);
    if (nextSelection) {
      return tr.setSelection(nextSelection);
    }
    return tr;
  };
// :: (selection: Selection) → boolean
// Checks if current selection is a `NodeSelection`.
//
// ```javascript
// if (isNodeSelection(tr.selection)) {
//   // ...
// }
// ```
export const isNodeSelection = (selection: Selection) => {
  return selection instanceof NodeSelection;
};

// (nodeType: union<NodeType, [NodeType]>) → boolean
// Checks if the type a given `node` equals to a given `nodeType`.
export const equalNodeType = (nodeType: NodeType | NodeType[], node: Node) => {
  return (Array.isArray(nodeType) && nodeType.indexOf(node.type) > -1) || node.type === nodeType;
};

// (tr: Transaction) → Transaction
// Creates a new transaction object from a given transaction
export const cloneTr = (tr: Transaction) => {
  return Object.assign(Object.create(tr), tr).setTime(Date.now());
};

// ($pos: ResolvedPos, doc: ProseMirrorNode, content: union<ProseMirrorNode, Fragment>, ) → boolean
// Checks if replacing a node at a given `$pos` inside of the `doc` node with the given `content` is possible.
export const canReplace = ($pos: ResolvedPos, content: Node | Fragment) => {
  const node = $pos.node($pos.depth);
  return (
    node && node.type.validContent(content instanceof Fragment ? content : Fragment.from(content))
  );
};

// (position: number, content: union<ProseMirrorNode, Fragment>) → (tr: Transaction) → Transaction
// Returns a `replace` transaction that replaces a node at a given position with the given `content`.
// It will return the original transaction if replacing is not possible.
// `position` should point at the position immediately before the node.
export const replaceNodeAtPos =
  (position: number, content: Node | Fragment) => (tr: Transaction) => {
    const node = tr.doc.nodeAt(position) as Node;
    const $pos = tr.doc.resolve(position);
    if (canReplace($pos, content)) {
      tr = tr.replaceWith(position, position + node.nodeSize, content);
      const start = tr.selection.$from.pos - 1;
      // put cursor inside of the inserted node
      tr = setTextSelection(Math.max(start, 0), -1)(tr);
      // move cursor to the start of the node
      tr = setTextSelection(tr.selection.$from.start())(tr);
      return cloneTr(tr);
    }
    return tr;
  };

// (position: number) → (tr: Transaction) → Transaction
// Returns a `delete` transaction that removes a node at a given position with the given `node`.
// `position` should point at the position immediately before the node.
export const removeNodeAtPos = (position: number) => (tr: Transaction) => {
  const node = tr.doc.nodeAt(position) as Node;
  return cloneTr(tr.delete(position, position + node.nodeSize));
};

// :: ($pos: ResolvedPos, content: union<ProseMirrorNode, Fragment>) → boolean
// Checks if a given `content` can be inserted at the given `$pos`
//
// ```javascript
// const { selection: { $from } } = state;
// const node = state.schema.nodes.atom.createChecked();
// if (canInsert($from, node)) {
//   // ...
// }
// ```
export const canInsert = ($pos: ResolvedPos, content: Node | Fragment) => {
  const index = $pos.index();

  if (content instanceof Fragment) {
    return $pos.parent.canReplace(index, index, content);
  }
  if (content instanceof Node) {
    return $pos.parent.canReplaceWith(index, index, content.type);
  }
  return false;
};

// (node: ProseMirrorNode) → boolean
// Checks if a given `node` is an empty paragraph
export const isEmptyParagraph = (node: Node) => {
  return !node || (node.type.name === 'paragraph' && node.nodeSize === 2);
};

export const checkInvalidMovements = (
  originIndex: number,
  targetIndex: number,
  targets: number[],
  type: string,
) => {
  const direction = originIndex > targetIndex ? -1 : 1;
  const errorMessage = `Target position is invalid, you can't move the ${type} ${originIndex} to ${targetIndex}, the target can't be split. You could use tryToFit option.`;

  if (direction === 1) {
    if (targets.slice(0, targets.length - 1).indexOf(targetIndex) !== -1) {
      throw new Error(errorMessage);
    }
  } else if (targets.slice(1).indexOf(targetIndex) !== -1) {
    throw new Error(errorMessage);
  }

  return true;
};
