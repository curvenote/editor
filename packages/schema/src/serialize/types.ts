import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Node } from 'prosemirror-model';
import type { GenericNode } from 'mystjs';

export enum TexFormatTypes {
  'tex' = 'tex',
  'tex_curvenote' = 'tex:curvenote',
}

export interface TexStatementOptions {
  command: string;
  commandOpts?: string;
  bracketOpts?: string;
  inline?: boolean;
  before?: string;
  after?: string;
}

export interface SharedMarkdownOptions {
  tightLists?: boolean | undefined;
  indent?: string;
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

export interface MarkdownOptions extends SharedMarkdownOptions {
  renderers?: {
    iframe?: 'html' | 'myst';
  };
  createMdastImportId?: () => string;
}

export interface TexOptions extends SharedMarkdownOptions {
  format?: TexFormatTypes;
}

export interface MdastOptions extends SharedMarkdownOptions {
  useSchema?: string;
}

export interface SharedSerializerState extends MarkdownSerializerState {
  options: SharedMarkdownOptions;
  delim?: string;
  nextCitationInGroup?: number;
  nextCaptionId?: string;
}

export interface MdSerializerState extends SharedSerializerState {
  options: MarkdownOptions;
  nextTableCaption?: Node | null;
  mdastSnippets?: Record<string, GenericNode>;
  mdastSerializer?: (node: Node) => GenericNode;
  out?: string;
}
export interface TexSerializerState extends SharedSerializerState {
  options: TexOptions;
  nextCaptionNumbered?: boolean;
  isInTable?: boolean;
  containsTable?: boolean;
  longFigure?: boolean;
}

export type MdFormatSerialize = (
  state: MdSerializerState,
  node: Node,
  parent: Node,
  index: number,
) => void;

export type TexFormatSerialize = (
  state: TexSerializerState,
  node: Node,
  parent: Node,
  index: number,
) => void;
