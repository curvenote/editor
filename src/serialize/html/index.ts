import { Node as ProsemirrorNode, DOMSerializer } from 'prosemirror-model';
import { getSchema, UseSchema } from '../../schemas';

export function toHTML(doc: ProsemirrorNode, useSchema: UseSchema, document: Document) {
  const schema = getSchema(useSchema);
  const div = document.createElement('div');
  const frag = DOMSerializer
    .fromSchema(schema)
    .serializeFragment(doc.content, { document });
  div.appendChild(frag);
  return div.innerHTML;
}
