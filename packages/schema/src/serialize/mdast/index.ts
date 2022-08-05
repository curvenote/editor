import type { Node as ProsemirrorNode } from 'prosemirror-model';
import type { GenericNode } from 'mystjs';
import type { Root } from '../../spec';
import { convertToMdast, convertToMdastSnippet } from './convertToMdast';
import type { MdastOptions } from '../types';

export function toMdast(doc: ProsemirrorNode, opts?: MdastOptions): Root {
  return convertToMdast(doc, opts ?? {});
}

export function toMdastSnippet(doc: ProsemirrorNode, opts?: MdastOptions): GenericNode {
  return convertToMdastSnippet(doc, opts ?? {});
}
