import { LinkAttrs } from './marks';
import { AlignOptions } from './nodes/types';

export * from './process/types';
export * from './parse/types';
export * from './serialize/types';
export type { LinkAttrs, AlignOptions };

export enum nodeNames {
  text = 'text',
  paragraph = 'paragraph',
  heading = 'heading',
  blockquote = 'blockquote',
  code_block = 'code_block',
  image = 'image',
  figure = 'figure',
  figcaption = 'figcaption',
  horizontal_rule = 'horizontal_rule',
  hard_break = 'hard_break',
  time = 'time',
  ordered_list = 'ordered_list',
  bullet_list = 'bullet_list',
  list_item = 'list_item',
  aside = 'aside',
  callout = 'callout',
  iframe = 'iframe',
  cite = 'cite',
  cite_group = 'cite_group',
  math = 'math',
  equation = 'equation',
  footnote = 'footnote',
  variable = 'variable',
  display = 'display',
  dynamic = 'dynamic',
  range = 'range',
  switch = 'switch',
  button = 'button',
  // tables
  table = 'table',
  table_row = 'table_row',
  table_cell = 'table_cell',
  table_header = 'table_header',
}
