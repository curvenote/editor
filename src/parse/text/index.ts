import { Schema, DOMParser as DOMParserPM } from 'prosemirror-model';

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
