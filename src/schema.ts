import * as basic from './nodes/basic';
import * as basicMarks from './marks';
import variable from './nodes/variable';
import display from './nodes/display';
import range from './nodes/range';
import dynamic from './nodes/dynamic';
import aside from './nodes/aside';
import callout from './nodes/callout';
import equation from './nodes/equation';
import equation_block from './nodes/equation_block';


export const nodes = {
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
  var: variable, // TODO: Update this to full `variable`
  display,
  dynamic,
  range,
  callout,
  aside,
  equation,
  equation_block,
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
};
