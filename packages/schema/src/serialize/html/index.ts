import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { DOMSerializer } from 'prosemirror-model';
import type { UseSchema } from '../../schemas';
import { getSchema } from '../../schemas';

export function toHTML(doc: ProsemirrorNode, useSchema: UseSchema, document: Document) {
  const schema = getSchema(useSchema);
  const div = document.createElement('div');
  const frag = DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document });
  div.appendChild(frag);
  return div.innerHTML;
}

export function toHTMLAsNode(doc: ProsemirrorNode, useSchema: UseSchema, document: Document) {
  const schema = getSchema(useSchema);
  const div = document.createElement('div');
  const frag = DOMSerializer.fromSchema(schema).serializeNode(doc, { document });
  div.appendChild(frag);
  return div.innerHTML;
}
