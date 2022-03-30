import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Root } from 'mdast';
import { UseSchema } from '../../schemas';

export function fromMdast(tree: Root, useSchema: UseSchema): ProsemirrorNode {
  return new ProsemirrorNode();
}
