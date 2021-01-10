import { Node as ProsemirrorNode, DOMSerializer, Schema } from 'prosemirror-model';

export function toHTML(doc: ProsemirrorNode, schema: Schema, document: Document) {
  const div = document.createElement('div');
  const frag = DOMSerializer
    .fromSchema(schema)
    .serializeFragment(doc.content, { document });
  div.appendChild(frag);
  return div.innerHTML;
}
