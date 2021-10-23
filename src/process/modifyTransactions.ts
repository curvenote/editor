import { Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { CaptionKind, NumberedNode } from '../nodes/types';
import { nodeNames } from '../types';
import { createId } from '../utils';
import { Attrs as FigcaptionAttrs } from '../nodes/figcaption';

type CaptionState = {
  deleteNext: boolean;
  kind: CaptionKind | null;
};

export function determineCaptionKind(node: Node): CaptionKind | null {
  if (node.type.name !== nodeNames.figure) return null;
  const childrenKinds: CaptionKind[] = [];
  node.forEach((n) => {
    switch (n.type.name) {
      case nodeNames.iframe:
      case nodeNames.image:
        childrenKinds.push(CaptionKind.fig);
        break;
      case nodeNames.table:
        childrenKinds.push(CaptionKind.table);
        break;
      case nodeNames.code_block:
        childrenKinds.push(CaptionKind.code);
        break;
      case nodeNames.equation:
        childrenKinds.push(CaptionKind.eq);
        break;
      default:
        break;
    }
  });
  return childrenKinds[0] ?? null;
}

export function modifyTransactionToValidDocState(tr: Transaction): Transaction {
  const transactions: ((tr: Transaction) => Transaction)[] = [];
  function deleteNode(node: Node, pos: number) {
    transactions.push((next: Transaction) => next.delete(pos, pos + node.nodeSize));
  }
  // State for walk
  const takenIds: Record<string, boolean> = {};
  const captionState: CaptionState = {
    deleteNext: false,
    kind: null,
  };

  // This checks if the ID has been seen or is invalid, and gives a replacement
  function ensureIdIsValidOrCreateId(id: string | null): { replace: boolean; id: string } {
    const taken = id ? takenIds[id] : true;
    if (!id || taken) return { replace: true, id: createId() };
    takenIds[id] = true;
    return { replace: false, id };
  }

  tr.doc.content.descendants((node, pos) => {
    switch (node.type.name) {
      case nodeNames.figure: {
        captionState.deleteNext = false;
        captionState.kind = determineCaptionKind(node);
        // Delete the empty figure!
        if (node.childCount === 0) deleteNode(node, pos);
        return true;
      }
      case nodeNames.figcaption: {
        if (captionState.deleteNext) {
          // Delete the second figure caption
          transactions.push((next: Transaction) => next.delete(pos, pos + node.nodeSize));
        } else {
          const { kind, id } = node.attrs as FigcaptionAttrs;
          const { kind: nextKind } = captionState; // Need to get access to the value, not the reference
          const nextId = ensureIdIsValidOrCreateId(id);
          if (kind !== nextKind || nextId.replace) {
            // Change the kind and id of the caption
            transactions.push((next: Transaction) =>
              next.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                kind: nextKind, // Note: this is the first one in the list
                id: nextId.id,
              }),
            );
          }
        }
        captionState.deleteNext = true;
        return false;
      }
      case nodeNames.heading: {
        const { id } = node.attrs as NumberedNode;
        const nextId = ensureIdIsValidOrCreateId(id);
        if (nextId.replace) {
          transactions.push((next: Transaction) =>
            next.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              id: nextId.id,
            }),
          );
        }
        return false;
      }
      case nodeNames.table: {
        if (node.childCount === 0) deleteNode(node, pos);
        return false;
      }
      // Continue to search
      case nodeNames.aside:
      case nodeNames.callout:
        return true;
      default:
        return false;
    }
  });
  const modified = transactions.reverse().reduce((next, chain) => chain(next), tr);
  return modified;
}
