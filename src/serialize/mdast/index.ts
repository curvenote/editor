import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Root } from 'myst-spec';
import { getSchema } from '../../schemas';
import { convertToMdast } from './convertToMdast';

export function toMdast(doc: ProsemirrorNode): Root {
  return convertToMdast(doc, getSchema('full'));
}
