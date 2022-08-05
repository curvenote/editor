import type { Node as ProsemirrorNode } from 'prosemirror-model';
import type { Transaction } from 'prosemirror-state';

export type Predicate<T = ProsemirrorNode> = (arg: T) => boolean;

export type DomAtPos = (pos: number) => { node: Node; offset: number };

export type ContentNodeWithPos = {
  pos: number;
  start: number;
  depth: number;
  node: ProsemirrorNode;
};

export type NodeWithPos = { pos: number; node: ProsemirrorNode };

export type CellTransform = (cell: ContentNodeWithPos, tr: Transaction) => Transaction;

export type MovementOptions = { tryToFit: boolean; direction?: -1 | 0 | 1 };
