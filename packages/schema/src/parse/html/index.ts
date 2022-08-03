import { DOMParser as DOMParserPM } from 'prosemirror-model';
import { setInnerHTML } from './utils';
import { Parser } from '../types';
import { getSchema, UseSchema } from '../../schemas';

export function fromHTML(
  content: string,
  useSchema: UseSchema,
  document: Document,
  DOMParser: Parser,
) {
  const schema = getSchema(useSchema);
  const element = setInnerHTML(document.createElement('div'), content, DOMParser) as HTMLDivElement;
  const doc = DOMParserPM.fromSchema(schema).parse(element);
  return doc;
}
