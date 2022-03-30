import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Root } from 'mdast';

export function toMdast(doc: ProsemirrorNode): Root {
  return doc;
}
