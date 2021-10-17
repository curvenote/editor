import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Node, Schema } from 'prosemirror-model';

export enum TexFormatTypes {
  'tex' = 'tex',
  'tex_curvenote' = 'tex:curvenote',
}

export interface TexStatementOptions {
  bracketOpts?: null | ((node: Node) => string | null);
  inline?: boolean;
}

export type MarkdownOptions = {
  tightLists?: boolean | null;
  localizeImageSrc?: (src: string) => string;
};

export type TexOptions = {
  tightLists?: boolean | null;
  format?: TexFormatTypes;
  localizeImageSrc?: (src: string) => string;
};

export interface MdSerializerState extends MarkdownSerializerState {
  options: MarkdownOptions;
  delim?: string;
}
export interface TexSerializerState extends MarkdownSerializerState {
  options: TexOptions;
  delim?: string;
}

export type MdFormatSerialize<S extends Schema<any, any> = any> = (
  state: MdSerializerState,
  node: Node<S>,
  parent: Node<S>,
  index: number,
) => void;

export type TexFormatSerialize<S extends Schema<any, any> = any> = (
  state: TexSerializerState,
  node: Node<S>,
  parent: Node<S>,
  index: number,
) => void;
