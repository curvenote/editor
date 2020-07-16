import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { markdownSerializer } from './serialize';
import { getMarkdownParser } from './parse';

export function fromMarkdown(content: string, schema: Schema) {
  const doc = getMarkdownParser(schema).parse(content);
  return doc;
}

export function toMarkdown(doc: ProsemirrorNode) {
  const md = markdownSerializer.serialize(doc);
  return md;
}
