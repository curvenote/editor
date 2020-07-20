import { Schema, Node as ProsemirrorNode } from 'prosemirror-model';
import MarkdownIt from 'markdown-it';
import markdownTexMath from 'markdown-it-texmath';
import Token from 'markdown-it/lib/token';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { MarkdownParser } from 'prosemirror-markdown';
import { myst_role_plugin } from './markdown-it-myst/myst_role';

// TODO: Use prosemirror-markdown when https://github.com/ProseMirror/prosemirror-markdown/issues/43 is resolved

const rules = {
  blockquote: { block: 'blockquote' },
  paragraph: { block: 'paragraph' },
  list_item: { block: 'list_item' },
  bullet_list: { block: 'bullet_list' },
  ordered_list: { block: 'ordered_list', getAttrs: (tok: Token) => ({ order: +(tok.attrGet('start') ?? 1) }) },
  heading: { block: 'heading', getAttrs: (tok: Token) => ({ level: +tok.tag.slice(1) }) },
  code_block: { block: 'code_block' },
  fence: { block: 'code_block', getAttrs: (tok: Token) => ({ params: tok.info || '' }) },
  hr: { node: 'horizontal_rule' },
  image: {
    node: 'image',
    getAttrs: (tok: Token) => ({
      src: tok.attrGet('src'),
      title: tok.attrGet('title') || null,
      alt: tok.children?.[0].content ?? null,
    }),
  },
  hardbreak: { node: 'hard_break' },

  math_inline: { block: 'equation', noCloseToken: true },
  math_inline_double: { block: 'equation', noCloseToken: true },
  math_block: { block: 'equation_block', noCloseToken: true },

  link: {
    mark: 'link',
    getAttrs: (tok: Token) => ({
      href: tok.attrGet('href'),
      title: tok.attrGet('title') || null,
    }),
  },
  em: { mark: 'em' },
  strong: { mark: 'strong' },
  code_inline: { mark: 'code' },

  sub: { mark: 'subscript', noCloseToken: true },
  sup: { mark: 'superscript', noCloseToken: true },

  abbr: {
    mark: 'abbr',
    getAttrs: (tok: Token) => ({
      title: tok.attrGet('title') || null,
    }),
    noCloseToken: true,
  },

  // myst_role: { mark: 'code', noCloseToken: true },
};

export function getMarkdownParser(schema: Schema) {
  const tokenizer = MarkdownIt('commonmark', { html: false });
  tokenizer.use(markdownTexMath, {
    engine: null, // We are not going to render ever.
    delimiters: 'dollars',
  });
  tokenizer.use(myst_role_plugin);
  type Parser = { parse: (content: string) => ProsemirrorNode };
  const parser: Parser = new MarkdownParser(schema, tokenizer, rules);
  return parser;
}
