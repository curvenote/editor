import { GenericNode } from 'mystjs';
import { MarkSpec } from 'prosemirror-model';
import { MarkGroups } from './nodes/types';

export interface MyMarkSpec extends MarkSpec {
  attrsFromMdastToken: (t: GenericNode) => Record<string, any>;
}

export type LinkAttrs = {
  href: string;
  title: string | null;
  kind: string;
};

export const link: MyMarkSpec = {
  attrs: {
    href: {},
    title: { default: null },
    kind: { default: 'external' },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs(dom: any) {
        return {
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title'),
          kind: dom.getAttribute('kind') || 'external',
        };
      },
    },
  ],
  toDOM(node) {
    const { href, title, kind } = node.attrs;
    return ['a', { href, title, kind }, 0];
  },
  attrsFromMdastToken(token) {
    return { href: token.url, title: token.title };
  },
};

export const code: MyMarkSpec = {
  attrs: {},
  parseDOM: [{ tag: 'code' }],
  toDOM() {
    return ['code', 0];
  },
  excludes: MarkGroups.format,
  attrsFromMdastToken: () => ({}),
};

export const em: MyMarkSpec = {
  attrs: {},
  parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
  toDOM() {
    return ['em', 0];
  },
  group: MarkGroups.format,
  attrsFromMdastToken: () => ({}),
};

export const strong: MyMarkSpec = {
  attrs: {},
  parseDOM: [
    { tag: 'strong' },
    // This works around a Google Docs misbehavior where
    // pasted content will be inexplicably wrapped in `<b>`
    // tags with a font-weight normal.
    { tag: 'b', getAttrs: (node: any) => node.style.fontWeight !== 'normal' && null },
    {
      style: 'font-weight',
      getAttrs: (value: any) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
    },
  ],
  toDOM() {
    return ['strong', 0];
  },
  group: MarkGroups.format,
  attrsFromMdastToken: () => ({}),
};

export const superscript: MyMarkSpec = {
  attrs: {},
  toDOM() {
    return ['sup', 0];
  },
  parseDOM: [{ tag: 'sup' }],
  excludes: 'subscript',
  group: MarkGroups.format,
  attrsFromMdastToken: () => ({}),
};

export const subscript: MyMarkSpec = {
  attrs: {},
  toDOM() {
    return ['sub', 0];
  },
  parseDOM: [{ tag: 'sub' }],
  excludes: 'superscript',
  group: MarkGroups.format,
  attrsFromMdastToken: () => ({}),
};

export const strikethrough: MyMarkSpec = {
  attrs: {},
  toDOM() {
    return ['s', 0];
  },
  parseDOM: [{ tag: 's' }],
  group: MarkGroups.format,
  attrsFromMdastToken: () => ({}),
};

export const underline: MyMarkSpec = {
  attrs: {},
  toDOM() {
    return ['u', 0];
  },
  parseDOM: [{ tag: 'u' }],
  group: MarkGroups.format,
  attrsFromMdastToken: () => ({}),
};

export const abbr: MyMarkSpec = {
  attrs: {
    title: { default: '' },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'abbr',
      getAttrs(dom: any) {
        return { title: dom.getAttribute('title') };
      },
    },
  ],
  toDOM(node) {
    const { title } = node.attrs;
    return ['abbr', { title }, 0];
  },
  attrsFromMdastToken(token: GenericNode) {
    return { title: token.title };
  },
};
