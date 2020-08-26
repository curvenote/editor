import {
  Schema, DOMSerializer, DOMParser as DOMParserPM, Node as ProsemirrorNode,
} from 'prosemirror-model';

export function fromText(
  content: string, schema: Schema, document: Document,
) {
  const div = document.createElement('div');
  const pre = document.createElement('pre');
  pre.textContent = content;
  div.append(pre);
  const doc = DOMParserPM.fromSchema(schema).parse(div);
  return doc;
}

export function toText(doc: ProsemirrorNode, schema: Schema, document: Document) {
  const div = document.createElement('div');
  const frag = DOMSerializer
    .fromSchema(schema)
    .serializeFragment(doc.content, { document });
  div.appendChild(frag);
  return div.textContent ?? '';
}
