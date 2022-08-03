import { Node } from 'prosemirror-model';
import { CaptionKind } from '../nodes/types';
import { nodeNames } from '../types';

function switchKind(node: Node) {
  switch (node.type.name) {
    case nodeNames.iframe:
    case nodeNames.image:
      return CaptionKind.fig;
    case nodeNames.table:
      return CaptionKind.table;
    case nodeNames.code_block:
      return CaptionKind.code;
    case nodeNames.equation:
      return CaptionKind.eq;
    default:
      return null;
  }
}

export function determineCaptionKind(node: Node): CaptionKind | null {
  if (node.type.name !== nodeNames.figure) return switchKind(node);
  const childrenKinds: CaptionKind[] = [];
  node.forEach((n) => {
    const kind = switchKind(n);
    if (kind) childrenKinds.push(kind);
  });
  return childrenKinds[0] ?? null;
}
