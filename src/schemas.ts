import { Schema } from 'prosemirror-model';
import * as basic from './nodes/basic';
import * as basicMarks from './marks';
import * as Nodes from './nodes';

export const listNodes = {
  ordered_list: basic.ordered_list,
  bullet_list: basic.bullet_list,
  list_item: basic.list_item,
};

export const presentationalNodes = {
  aside: Nodes.Aside.default,
  callout: Nodes.Callout.default,
  iframe: Nodes.IFrame.default,
};

export const citationNodes = {
  cite: Nodes.Cite.default,
  cite_group: Nodes.CiteGroup.default,
};

export const mathNodes = {
  math: Nodes.Math.default,
  equation: Nodes.Equation.default,
};

export const reactiveDisplayNodes = {
  // Does NOT include variable definitions
  display: Nodes.Display.default,
  dynamic: Nodes.Dynamic.default,
  range: Nodes.Range.default,
  switch: Nodes.Switch.default,
  button: Nodes.Button.default,
};

export const nodes = {
  // Basic markdown
  doc: basic.doc,
  text: basic.text,
  paragraph: basic.paragraph,
  heading: Nodes.Heading.default,
  blockquote: basic.blockquote,
  code_block: basic.code_block,
  image: Nodes.Image.default,
  horizontal_rule: basic.horizontal_rule,
  hard_break: basic.hard_break,
  time: Nodes.Time.default,
  ...listNodes,
  // Presentational components
  ...presentationalNodes,
  ...citationNodes,
  ...mathNodes,
  variable: Nodes.Variable.default,
  ...reactiveDisplayNodes,
};

export enum nodeNames {
  text = 'text',
  paragraph = 'paragraph',
  heading = 'heading',
  blockquote = 'blockquote',
  code_block = 'code_block',
  image = 'image',
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
  variable = 'variable',
  display = 'display',
  dynamic = 'dynamic',
  range = 'range',
  switch = 'switch',
  button = 'button',
}

export const marks = {
  link: basicMarks.link,
  code: basicMarks.code,
  em: basicMarks.em,
  strong: basicMarks.strong,
  superscript: basicMarks.superscript,
  subscript: basicMarks.subscript,
  strikethrough: basicMarks.strikethrough,
  underline: basicMarks.underline,
  abbr: basicMarks.abbr,
};

export const presets = {
  full: {
    nodes,
    marks,
  },
  paragraph: {
    nodes: {
      doc: basic.docParagraph,
      paragraph: basic.paragraph,
      text: basic.text,
      hard_break: basic.hard_break,
      time: Nodes.Time.default,
      ...citationNodes,
      math: mathNodes.math,
      ...reactiveDisplayNodes,
    },
    marks,
  },
};

export type PresetSchemas = keyof typeof presets;
export type UseSchema = PresetSchemas | { nodes: Record<string, Node>; } | Schema;

export function getSchema(useSchema: UseSchema) {
  if (typeof useSchema === 'string') {
    switch (useSchema) {
      case 'full':
        return new Schema(presets.full);
      case 'paragraph':
        return new Schema(presets.paragraph);
      default:
        throw new Error(`Schema '${useSchema}' is not defined.`);
    }
  }
  if ('spec' in useSchema) return useSchema;
  return new Schema(useSchema);
}
