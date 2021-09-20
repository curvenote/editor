import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Node, NodeSpec, AttributeSpec, Schema, ParseRule } from 'prosemirror-model';

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

export type FormatSerialize<S extends Schema<any, any> = any> = (
  state: MarkdownSerializerState & { delim?: string },
  node: Node<S>,
  parent: Node<S>,
  index: number,
) => void;
