import { MarkdownSerializerState } from 'prosemirror-markdown';
import { Node, Schema } from 'prosemirror-model';

export enum NodeGroups {
  'top' = 'topblock',
  'block' = 'block',
  'inline' = 'inline',
  'text' = 'text',
}

export enum MarkGroups {
  'format' = 'format',
}

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
  state: MarkdownSerializerState<S> & {delim?: string},
  node: Node<S>,
  parent: Node<S>,
  index: number
) => void;
