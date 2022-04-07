import { GenericNode } from 'mystjs';
import { MarkSpec } from 'prosemirror-model';
import {
  MystNode,
  Abbreviation,
  Emphasis,
  InlineCode,
  Link,
  PhrasingContent,
  StaticPhrasingContent,
  Strong,
  Subscript,
  Superscript,
  Underline,
  Strikethrough,
} from './spec';
import { MarkGroups, Props } from './nodes/types';
import { MdastOptions } from './serialize/types';

export interface MyMarkSpec<N extends MystNode> extends MarkSpec {
  attrsFromMyst: (t: GenericNode) => Record<string, any>;
  toMyst: (props: Props, opts: MdastOptions) => N;
}

export type LinkAttrs = {
  href: string;
  title: string | null;
  kind: string;
};

export const link: MyMarkSpec<Link> = {
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
  attrsFromMyst(token) {
    return { href: token.url, title: token.title };
  },
  toMyst: (props, opts): Link => ({
    type: 'link',
    url: opts.localizeLink?.(props.href) ?? props.href,
    title: props.title || undefined,
    children: (props.children || []) as StaticPhrasingContent[],
  }),
};

export const code: MyMarkSpec<InlineCode> = {
  attrs: {},
  parseDOM: [{ tag: 'code' }],
  toDOM() {
    return ['code', 0];
  },
  excludes: MarkGroups.format,
  attrsFromMyst: () => ({}),
  toMyst: (props) => {
    if (props.children?.length === 1 && props.children[0].type === 'text') {
      return { type: 'inlineCode', value: props.children[0].value || '' };
    }
    throw new Error(`Code node does not have one child`);
  },
};

export const em: MyMarkSpec<Emphasis> = {
  attrs: {},
  parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
  toDOM() {
    return ['em', 0];
  },
  group: MarkGroups.format,
  attrsFromMyst: () => ({}),
  toMyst: (props) => ({
    type: 'emphasis',
    children: (props.children || []) as PhrasingContent[],
  }),
};

export const strong: MyMarkSpec<Strong> = {
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
  attrsFromMyst: () => ({}),
  toMyst: (props) => ({
    type: 'strong',
    children: (props.children || []) as PhrasingContent[],
  }),
};

export const superscript: MyMarkSpec<Superscript> = {
  attrs: {},
  toDOM() {
    return ['sup', 0];
  },
  parseDOM: [{ tag: 'sup' }],
  excludes: 'subscript',
  group: MarkGroups.format,
  attrsFromMyst: () => ({}),
  toMyst: (props) => ({
    type: 'superscript',
    children: (props.children || []) as PhrasingContent[],
  }),
};

export const subscript: MyMarkSpec<Subscript> = {
  attrs: {},
  toDOM() {
    return ['sub', 0];
  },
  parseDOM: [{ tag: 'sub' }],
  excludes: 'superscript',
  group: MarkGroups.format,
  attrsFromMyst: () => ({}),
  toMyst: (props) => ({
    type: 'subscript',
    children: (props.children || []) as PhrasingContent[],
  }),
};

export const strikethrough: MyMarkSpec<Strikethrough> = {
  attrs: {},
  toDOM() {
    return ['s', 0];
  },
  parseDOM: [{ tag: 's' }],
  group: MarkGroups.format,
  attrsFromMyst: () => ({}),
  toMyst: (props) => ({
    type: 'delete',
    children: (props.children || []) as PhrasingContent[],
  }),
};

export const underline: MyMarkSpec<Underline> = {
  attrs: {},
  toDOM() {
    return ['u', 0];
  },
  parseDOM: [{ tag: 'u' }],
  group: MarkGroups.format,
  attrsFromMyst: () => ({}),
  toMyst: (props) => ({
    type: 'underline',
    children: (props.children || []) as PhrasingContent[],
  }),
};

export const abbr: MyMarkSpec<Abbreviation> = {
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
  attrsFromMyst(token: GenericNode) {
    return { title: token.title };
  },
  toMyst: (props) => ({
    type: 'abbreviation',
    title: props.title || undefined,
    children: (props.children || []) as StaticPhrasingContent[],
  }),
};
