import { DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model';
import { getSchema, UseSchema } from '../../schemas';

export function toText(doc: ProsemirrorNode, useSchema: UseSchema, document: Document) {
  const div = document.createElement('div');
  const schema = getSchema(useSchema);
  const frag = DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document });
  div.appendChild(frag);
  return div.textContent ?? '';
}
