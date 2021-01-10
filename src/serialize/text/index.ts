import { Schema, DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model';

export function toText(doc: ProsemirrorNode, schema: Schema, document: Document) {
  const div = document.createElement('div');
  const frag = DOMSerializer
    .fromSchema(schema)
    .serializeFragment(doc.content, { document });
  div.appendChild(frag);
  return div.textContent ?? '';
}
