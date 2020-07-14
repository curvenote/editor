import { Node as ProsemirrorNode } from 'prosemirror-model';
import { defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';

export function fromMarkdown(content: string) {
  const doc = defaultMarkdownParser.parse(content);
  return doc;
}

export function toMarkdown(doc: ProsemirrorNode) {
  const md = defaultMarkdownSerializer.serialize(doc);
  return md;
}
