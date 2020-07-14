import { Schema, NodeSpec, MarkSpec } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import OrderedMap from 'orderedmap';
import variable from './nodes/variable';
import display from './nodes/display';
import range from './nodes/range';
import dynamic from './nodes/dynamic';
import aside from './nodes/aside';
import callout from './nodes/callout';
import equation from './nodes/equation';
import { NodeGroups, MarkGroups } from './nodes/types';

const listNodes = addListNodes(OrderedMap.from({}), `paragraph ${NodeGroups.block}*`, NodeGroups.block);

export const nodes = {
  doc: {
    content: `(${NodeGroups.block} | ${NodeGroups.top})+`,
  } as NodeSpec,
  paragraph: {
    content: `${NodeGroups.inline}*`,
    group: NodeGroups.block,
    parseDOM: [{ tag: 'p' }],
    toDOM() { return ['p', 0]; },
  } as NodeSpec,
  blockquote: {
    content: `${NodeGroups.block}+`,
    group: NodeGroups.block,
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() { return ['blockquote', 0]; },
  } as NodeSpec,
  horizontal_rule: {
    group: NodeGroups.block,
    parseDOM: [{ tag: 'hr' }],
    toDOM() { return ['hr']; },
  } as NodeSpec,
  heading: {
    attrs: { level: { default: 1 } },
    content: `${NodeGroups.inline}*`,
    group: NodeGroups.block,
    defining: true,
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    toDOM(node) { return [`h${node.attrs.level}`, 0]; },
  } as NodeSpec,
  code_block: {
    content: `${NodeGroups.text}*`,
    marks: '',
    group: NodeGroups.block,
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() { return ['pre', ['code', 0]]; },
  } as NodeSpec,
  text: {
    group: NodeGroups.inline,
  } as NodeSpec,
  image: {
    inline: true,
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null },
    },
    group: NodeGroups.inline,
    draggable: true,
    parseDOM: [{
      tag: 'img[src]',
      getAttrs(dom: any) {
        return {
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
        };
      },
    }],
    toDOM(node) { const { src, alt, title } = node.attrs; return ['img', { src, alt, title }]; },
  } as NodeSpec,
  hard_break: {
    inline: true,
    group: NodeGroups.inline,
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() { return ['br']; },
  } as NodeSpec,
  ordered_list: listNodes.get('ordered_list'),
  bullet_list: listNodes.get('bullet_list'),
  list_item: listNodes.get('list_item'),
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

// NOTE: this should not be used in the frontend. Create your own!
export const schema = new Schema({ nodes, marks });
