import {
  Schema, DOMSerializer, DOMParser as DOMParserPM, Node as ProsemirrorNode,
} from 'prosemirror-model';
import { migrateHTML } from './migrate';
import { Parser } from '../types';

export { migrateHTML };

export function fromHTML(
  content: string, schema: Schema, document: Document, DOMParser: Parser,
) {
  const element = migrateHTML(content, document, DOMParser);
  const doc = DOMParserPM.fromSchema(schema).parse(element);
  return doc;
}

export function toHTML(doc: ProsemirrorNode, schema: Schema, document: Document) {
  const div = document.createElement('div');
  const frag = DOMSerializer
    .fromSchema(schema)
    .serializeFragment(doc.content, { document });
  div.appendChild(frag);
  return div.innerHTML;
}
