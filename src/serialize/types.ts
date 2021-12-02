import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Node, Schema } from 'prosemirror-model';

export enum TexFormatTypes {
  'tex' = 'tex',
  'tex_curvenote' = 'tex:curvenote',
}

export interface TexStatementOptions {
  command: string;
  bracketOpts?: string;
  inline?: boolean;
  before?: string;
  after?: string;
}

export type MarkdownOptions = {
  tightLists?: boolean | null;
  localizeImageSrc?: (src: string) => string;
};

export type TexOptions = {
  tightLists?: boolean | null;
  format?: TexFormatTypes;
  localizeId?: (id: string) => string;
  localizeImageSrc?: (src: string) => string;
  indent?: string;
  nextCaptionNumbered?: boolean;
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
