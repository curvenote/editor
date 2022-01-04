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

export interface SharedOptions {
  tightLists?: boolean | null;
  /**
   * Localize a reference, e.g. take an ID and create a local ID
   */
  localizeId?: (id: string) => string;
  /**
   * Localize a citation from a key to a local ID
   */
  localizeCitation?: (id: string) => string;
  localizeImageSrc?: (src: string) => string;
  localizeLink?: (src: string) => string;
}

export type MarkdownOptions = SharedOptions;

export interface TexOptions extends SharedOptions {
  format?: TexFormatTypes;
  indent?: string;
}

export interface SharedSerializerState extends MarkdownSerializerState {
  delim?: string;
  nextCitationInGroup?: number;
}

export interface MdSerializerState extends SharedSerializerState {
  options: MarkdownOptions;
}
export interface TexSerializerState extends SharedSerializerState {
  options: TexOptions;
  nextCaptionNumbered?: boolean;
  nextCaptionId?: string;
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
