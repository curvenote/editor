import { MarkSpec } from 'prosemirror-model';
import { MarkGroups } from './nodes/types';

export const link: MarkSpec = {
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
};
export const code: MarkSpec = {
  parseDOM: [{ tag: 'code' }],
  toDOM() { return ['code', 0]; },
  excludes: MarkGroups.format,
};
export const em: MarkSpec = {
  parseDOM: [
    { tag: 'i' },
    { tag: 'em' },
    { style: 'font-style=italic' },
  ],
  toDOM() { return ['em', 0]; },
  group: MarkGroups.format,
};
export const strong: MarkSpec = {
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
};
export const superscript: MarkSpec = {
  toDOM() { return ['sup', 0]; },
  parseDOM: [{ tag: 'sup' }],
  excludes: 'subscript',
  group: MarkGroups.format,
};
export const subscript: MarkSpec = {
  toDOM() { return ['sub', 0]; },
  parseDOM: [{ tag: 'sub' }],
  excludes: 'superscript',
  group: MarkGroups.format,
};
export const strikethrough: MarkSpec = {
  toDOM() { return ['s', 0]; },
  parseDOM: [{ tag: 's' }],
  group: MarkGroups.format,
};
export const underline: MarkSpec = {
  toDOM() { return ['u', 0]; },
  parseDOM: [{ tag: 'u' }],
  group: MarkGroups.format,
};
