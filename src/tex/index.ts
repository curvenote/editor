import { Node as ProsemirrorNode } from 'prosemirror-model';
import { texSerializer } from './serialize';

export function toTex(doc: ProsemirrorNode) {
  return texSerializer.serialize(doc);
}
