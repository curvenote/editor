import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Root } from 'myst-spec';
import { GenericNode } from 'mystjs';
import { getSchema } from '../../schemas';
import { convertToMdast, convertToMdastSnippet } from './convertToMdast';

export function toMdast(doc: ProsemirrorNode): Root {
  return convertToMdast(doc, getSchema('full'));
}

export function toMdastSnippet(doc: ProsemirrorNode): GenericNode {
  return convertToMdastSnippet(doc, getSchema('full'));
}
