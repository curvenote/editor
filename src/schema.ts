import { NodeSpec, MarkSpec } from 'prosemirror-model';
import * as basic from './nodes/basic';
import variable from './nodes/variable';
import display from './nodes/display';
import range from './nodes/range';
import dynamic from './nodes/dynamic';
import aside from './nodes/aside';
import callout from './nodes/callout';
import equation from './nodes/equation';
import { NodeGroups, MarkGroups } from './nodes/types';


export const nodes = {
  doc: {
    content: `(${NodeGroups.block} | ${NodeGroups.top})+`,
  } as NodeSpec,
  paragraph: basic.paragraph,
  blockquote: basic.blockquote,
  horizontal_rule: basic.horizontal_rule,
  heading: basic.heading,
  code_block: basic.code_block,
  text: basic.text,
  image: basic.image,
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
};

export const marks = {
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [{
      tag: 'a[href]',
      getAttrs(dom: any) {
        return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
      },
    }],
    toDOM(node) { const { href, title } = node.attrs; return ['a', { href, title }, 0]; },
  } as MarkSpec,
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() { return ['code', 0]; },
    excludes: MarkGroups.format,
  } as MarkSpec,
  em: {
    parseDOM: [
      { tag: 'i' },
      { tag: 'em' },
      { style: 'font-style=italic' },
    ],
    toDOM() { return ['em', 0]; },
    group: MarkGroups.format,
  } as MarkSpec,
  strong: {
    parseDOM: [
      { tag: 'strong' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      { tag: 'b', getAttrs: (node: any) => node.style.fontWeight !== 'normal' && null },
      { style: 'font-weight', getAttrs: (value: any) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null },
    ],
    toDOM() { return ['strong', 0]; },
    group: MarkGroups.format,
  } as MarkSpec,
  superscript: {
    toDOM() { return ['sup', 0]; },
    parseDOM: [{ tag: 'sup' }],
    excludes: 'subscript',
    group: MarkGroups.format,
  } as MarkSpec,
  subscript: {
    toDOM() { return ['sub', 0]; },
    parseDOM: [{ tag: 'sub' }],
    excludes: 'superscript',
    group: MarkGroups.format,
  } as MarkSpec,
  strikethrough: {
    toDOM() { return ['s', 0]; },
    parseDOM: [{ tag: 's' }],
    group: MarkGroups.format,
  } as MarkSpec,
  underline: {
    toDOM() { return ['u', 0]; },
    parseDOM: [{ tag: 'u' }],
    group: MarkGroups.format,
  } as MarkSpec,
};
