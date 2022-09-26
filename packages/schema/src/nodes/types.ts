import type { GenericNode } from 'mystjs';
import type { NodeSpec, AttributeSpec, ParseRule } from 'prosemirror-model';
import type { MystNode } from '../spec';
import type { MdastOptions } from '../serialize/types';

export enum CaptionKind {
  fig = 'fig',
  eq = 'eq',
  code = 'code',
  table = 'table',
}

export enum ReferenceKind {
  cite = 'cite',
  link = 'link',
  sec = 'sec',
  fig = 'fig',
  eq = 'eq',
  code = 'code',
  table = 'table',
}

export const LEGACY_NODE_GROUPS = {
  top: 'topblock',
  content: 'block',
  heading: 'heading',
  blockOrHeading: '(block | heading)+',
  blockOrEquation: '(block | equation)+',
  blockOrEquationOrHeading: '(block | heading | equation)+',
  inline: 'inline',
  text: 'text',
  cite: 'cite',
  // This allows you to drag images in/out and reposition the figure caption
  // It does mean that the figure can be empty, which is not good
  // We need to delete this empty figure in a post processing step
  // This also allows two figure captions
  // 'insideFigure' = 'figcaption{0,1} (image | code_block | iframe | table)* figcaption{0,1}',
  // 'insideFigure' = '(figcaption | image | code_block | iframe | table)+',
  insideFigure: '(figcaption | image | iframe | table | code_block){1,2}',
} as const;

export const ARTICLE_NODE_GROUPS = {
  block: 'block', // NOTE: naming here needs some work (requirements: avoid collision)
  top: 'topcontent',
  content: 'content',
  heading: 'heading',
  blockOrHeading: '(content | heading)+',
  blockOrEquation: '(content | equation)+',
  blockOrEquationOrHeading: '(content | heading | equation)+',
  inline: 'inline',
  text: 'text',
  cite: 'cite',
  // This allows you to drag images in/out and reposition the figure caption
  // It does mean that the figure can be empty, which is not good
  // We need to delete this empty figure in a post processing step
  // This also allows two figure captions
  // 'insideFigure' = 'figcaption{0,1} (image | code_block | iframe | table)* figcaption{0,1}',
  // 'insideFigure' = '(figcaption | image | code_block | iframe | table)+',
  insideFigure: '(figcaption | image | iframe | table | code_block){1,2}',
} as const;

export type LegacyNodeGroup = typeof LEGACY_NODE_GROUPS;
export type NextNodeGroup = typeof ARTICLE_NODE_GROUPS;
export type NodeGroup = LegacyNodeGroup | NextNodeGroup;
export const NODE_GROUPS = {
  article: ARTICLE_NODE_GROUPS,
  legacy: LEGACY_NODE_GROUPS,
};

export enum MarkGroups {
  'format' = 'format',
}

type O = Record<string, any>;
export type NodeSpecAttrs<T extends O> = Record<keyof T, AttributeSpec>;

export interface MyParseRule<T extends O> extends ParseRule {
  getAttrs?: (p: any) => T;
}

export type Props<T extends O = O> = T &
  O & {
    key: string;
    children?: GenericNode[];
  };

export interface MyNodeSpec<T extends O, N extends MystNode> extends NodeSpec {
  attrs: NodeSpecAttrs<T>;
  parseDOM?: MyParseRule<T>[];
  attrsFromMyst: (t: N, ts: GenericNode[]) => T;
  toMyst: (props: Props<T>, opts: MdastOptions) => N;
}

export type NumberedNode = {
  id: string | null;
  label: string | null;
  numbered: boolean;
};

export type AlignOptions = 'left' | 'center' | 'right';

export type Attr = {
  name: string;
  func: boolean | 'only';
  default: string | false;
  optional: boolean;
};

export type NodeDef = {
  tag: string;
  name: string;
  mystType: string;
  attrs: Attr[];
  inline: boolean;
  group: string;
};
