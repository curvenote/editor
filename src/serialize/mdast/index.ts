import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Root } from 'myst-spec';
import { GenericNode } from 'mystjs';
import { convertToMdast, convertToMdastSnippet } from './convertToMdast';
import { MdastOptions } from '../types';

export function toMdast(doc: ProsemirrorNode, opts?: MdastOptions): Root {
  return convertToMdast(doc, opts ?? {});
}

export function toMdastSnippet(doc: ProsemirrorNode, opts?: MdastOptions): GenericNode {
  return convertToMdastSnippet(doc, opts ?? {});
}
