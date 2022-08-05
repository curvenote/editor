import { MyST } from 'mystjs';
import type { Root } from '../../spec';
import { fromMdast } from '../mdast';
import type { UseSchema } from '../../schemas';

export function fromMarkdown(content: string, useSchema: UseSchema) {
  const parser = new MyST();
  const tree = parser.parse(content);
  const doc = fromMdast(tree as Root, useSchema);
  return doc;
}
