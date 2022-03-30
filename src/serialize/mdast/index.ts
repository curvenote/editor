import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Root } from 'myst-spec';
import { getSchema, UseSchema } from '../../schemas';
import { convertToMdast } from './convertToMdast';

export function toMdast(doc: ProsemirrorNode, useSchema: UseSchema): Root {
  const schema = getSchema(useSchema);
  return convertToMdast(doc, schema);
}
