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

export const reactiveNodes = {
  variable: Nodes.Variable.default,
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
  heading: basic.heading,
  blockquote: basic.blockquote,
  code_block: basic.code_block,
  image: Nodes.Image.default,
  horizontal_rule: basic.horizontal_rule,
  hard_break: basic.hard_break,
  ...listNodes,
  // Presentational components
  ...presentationalNodes,
  ...citationNodes,
  ...mathNodes,
  ...reactiveNodes,
};

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
      ...citationNodes,
      math: mathNodes.math,
      ...reactiveNodes,
    },
    marks,
  },
};

export type PresetSchemas = keyof typeof presets;
export type UseSchema = PresetSchemas | { nodes: Record<string, Node>; };

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
  return new Schema(useSchema);
}
