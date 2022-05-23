import { customAlphabet } from 'nanoid';
import { Node } from 'prosemirror-model';
import { nodeNames } from '../types';

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const az = 'abcdefghijklmnopqrstuvwxyz';
const alpha = az + az.toUpperCase();
const numbers = '0123456789';
const nanoidAZ = customAlphabet(alpha, 1);
const nanoidAZ9 = customAlphabet(alpha + numbers, 9);

export function createId() {
  return nanoidAZ() + nanoidAZ9();
}

export type NodeWithPos = { pos: number; node: Node };

export function findChildrenWithName(
  parent: Node,
  nodeName: nodeNames | nodeNames[],
): NodeWithPos[] {
  const predicate =
    typeof nodeName === 'string'
      ? (n: Node) => n.type.name === nodeName
      : (n: Node) => nodeName.includes(n.type.name as nodeNames);
  const result: NodeWithPos[] = [];
  parent.descendants((child, pos) => {
    if (predicate(child)) result.push({ node: child, pos });
    return true;
  });
  return result;
}
