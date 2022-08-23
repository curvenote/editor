import { Schema } from 'prosemirror-model';

import * as basic from './nodes/basic';
import { nodes as tableNodes } from './nodes/table';
import * as basicMarks from './marks';
import * as Nodes from './nodes';
import { nodeNames } from './types';

export const listNodes = {
  ordered_list: basic.ordered_list,
  bullet_list: basic.bullet_list,
  list_item: basic.list_item,
};

export const presentationalNodes = {
  aside: Nodes.Aside.default,
  callout: Nodes.Callout.default,
  link_block: Nodes.LinkBlock.default,
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
export const mathNodesNoDisplay = {
  math: Nodes.Math.mathNoDisplay,
  equation: Nodes.Equation.equationNoDisplay,
};

export const reactiveDisplayNodes = {
  // Does NOT include variable definitions
  display: Nodes.Display.default,
  dynamic: Nodes.Dynamic.default,
  range: Nodes.Range.default,
  switch: Nodes.Switch.default,
  button: Nodes.Button.default,
};

export const reactiveNodes = {
  variable: Nodes.Variable.default,
  ...reactiveDisplayNodes,
};

export const nodes = {
  // Basic markdown
  doc: basic.doc,
  [nodeNames.block]: basic.block,
  text: basic.text,
  paragraph: basic.paragraph,
  heading: Nodes.Heading.default,
  footnote: Nodes.Footnote.default,
  blockquote: basic.blockquote,
  code_block: Nodes.Code.default,
  figure: Nodes.Figure.default,
  figcaption: Nodes.Figcaption.default,
  image: Nodes.Image.default,
  horizontal_rule: basic.horizontal_rule,
  hard_break: basic.hard_break,
  time: Nodes.Time.default,
  ...listNodes,
  ...tableNodes,
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
      time: Nodes.Time.default,
      footnote: Nodes.Footnote.default,
      ...citationNodes,
      math: mathNodes.math,
      ...reactiveDisplayNodes,
    },
    marks,
  },
  comment: {
    nodes: {
      doc: basic.docComment,
      paragraph: basic.paragraph,
      heading: Nodes.Heading.default,
      text: basic.text,
      blockquote: basic.blockquote,
      footnote: Nodes.Footnote.default,
      code_block: Nodes.Code.default,
      horizontal_rule: basic.horizontal_rule,
      hard_break: basic.hard_break,
      time: Nodes.Time.default,
      mention: Nodes.Mention.default,
      ...listNodes,
      ...citationNodes,
      ...mathNodesNoDisplay,
    },
    marks,
  },
};

export type PresetSchemas = keyof typeof presets;
export type UseSchema = PresetSchemas | { nodes: Record<string, Node> } | Schema;

export function getSchema(useSchema: UseSchema) {
  if (typeof useSchema === 'string') {
    switch (useSchema) {
      case 'full':
        return new Schema(presets.full as any);
      case 'paragraph':
        return new Schema(presets.paragraph);
      case 'comment':
        return new Schema(presets.comment);
      default:
        throw new Error(`Schema '${useSchema}' is not defined.`);
    }
  }
  if ('spec' in useSchema) return useSchema;
  return new Schema(useSchema);
}
