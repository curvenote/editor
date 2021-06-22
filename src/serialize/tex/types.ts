import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Node as ProsemirrorNode } from 'prosemirror-model';

export enum LatexFormatTypes {
  'tex' = 'tex',
  'tex_curvenote' = 'tex:curvenote',
}

export interface LatexOptions {
  tightLists?: boolean | null;
  format?: LatexFormatTypes;
}

export interface LatexStatementOptions {
  bracketOpts?: null | ((node: ProsemirrorNode) => string | null);
  inline?: boolean;
}

export interface LatexSerializerState extends MarkdownSerializerState {
  options: LatexOptions;
  delim?: string;
}
