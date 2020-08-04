import * as basic from './nodes/basic';
import * as basicMarks from './marks';
import * as Nodes from './nodes';


export const nodes = {
  // Basic markdown
  doc: basic.doc,
  text: basic.text,
  paragraph: basic.paragraph,
  heading: basic.heading,
  blockquote: basic.blockquote,
  code_block: basic.code_block,
  image: basic.image,
  horizontal_rule: basic.horizontal_rule,
  hard_break: basic.hard_break,
  ordered_list: basic.ordered_list,
  bullet_list: basic.bullet_list,
  list_item: basic.list_item,
  // Presentational components
  callout: Nodes.Callout.default,
  aside: Nodes.Aside.default,
  math: Nodes.Math.default,
  equation: Nodes.Equation.default,
  // Reactive components
  variable: Nodes.Variable.default,
  display: Nodes.Display.default,
  dynamic: Nodes.Dynamic.default,
  range: Nodes.Range.default,
  switch: Nodes.Switch.default,
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
