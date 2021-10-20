import { NodeSpec, AttributeSpec, ParseRule } from 'prosemirror-model';

export enum ReferenceKind {
  cite = 'cite',
  link = 'link',
  sec = 'sec',
  fig = 'fig',
  eq = 'eq',
  code = 'code',
  table = 'table',
}

export enum NodeGroups {
  'top' = 'topblock',
  'block' = 'block',
  'heading' = 'heading',
  'blockOrHeading' = '(block | heading)+',
  'blockOrEquation' = '(block | equation)+',
  'blockOrEquationOrHeading' = '(block | heading | equation)+',
  'inline' = 'inline',
  'text' = 'text',
  'cite' = 'cite',
  // This allows you to drag images in/out and reposition the figure caption
  // It does mean that the figure can be empty, which is not good
  // We need to delete this empty figure in a post processing step
  // This also allows two figure captions
  'insideFigure' = 'figcaption{0,1} (image | code_block | iframe | table)* figcaption{0,1}',
  // 'insideFigure' = '(figcaption | image | code_block | iframe | table)+',
}

export enum MarkGroups {
  'format' = 'format',
}

type O = Record<string, any>;
export type NodeSpecAttrs<T extends O> = Record<keyof T, AttributeSpec>;

export interface MyParseRule<T extends O> extends ParseRule {
  getAttrs?: (p: any) => T;
}

export interface MyNodeSpec<T extends O> extends NodeSpec {
  attrs: NodeSpecAttrs<T>;
  parseDOM?: MyParseRule<T>[];
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
  attrs: Attr[];
  inline: boolean;
  group: NodeGroups;
};
