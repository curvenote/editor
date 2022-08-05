import { DOMParser as DOMParserPM } from 'prosemirror-model';
import type { UseSchema } from '../../schemas';
import { getSchema } from '../../schemas';

export function fromText(content: string, useSchema: UseSchema, document: Document) {
  const schema = getSchema(useSchema);
  const div = document.createElement('div');
  const pre = document.createElement('pre');
  pre.textContent = content;
  div.append(pre);
  const doc = DOMParserPM.fromSchema(schema).parse(div);
  return doc;
}
