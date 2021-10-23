import { nanoid } from 'nanoid';
import { Node } from 'prosemirror-model';
import { findChildren } from 'prosemirror-utils';
import { nodeNames } from '../types';

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function createId() {
  return nanoid(10);
}

export function findChildrenWithName(parent: Node, nodeName: nodeNames | nodeNames[]) {
  const predicate =
    typeof nodeName === 'string'
      ? (n: Node) => n.type.name === nodeName
      : (n: Node) => nodeName.includes(n.type.name as nodeNames);
  const nodes = findChildren(parent, predicate);
  return nodes;
}
