import { mystParse } from 'myst-parser';
import type { Root } from '../../nodespec';
import { fromMdast } from '../mdast';
import type { UseSchema } from '../../schemas';

export function fromMarkdown(content: string, useSchema: UseSchema) {
  const tree = mystParse(content);
  const doc = fromMdast(tree as Root, useSchema);
  return doc;
}
