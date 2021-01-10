import { Schema, Node as ProsemirrorNode } from 'prosemirror-model';
import Token from 'markdown-it/lib/token';
import { MarkdownParser, TokenConfig } from 'prosemirror-markdown';
import MyST from 'markdown-it-myst';
import { DEFAULT_IMAGE_WIDTH } from '../../utils';

type Tokens = {
  [key: string]: TokenConfig & { noCloseToken?: boolean };
};
const tokens: Tokens = {
  blockquote: { block: 'blockquote' },
  paragraph: { block: 'paragraph' },
  list_item: { block: 'list_item' },
  bullet_list: { block: 'bullet_list' },
  ordered_list: { block: 'ordered_list', getAttrs: (tok: Token) => ({ order: +(tok.attrGet('start') ?? 1) }) },
  heading: { block: 'heading', getAttrs: (tok: Token) => ({ level: +tok.tag.slice(1) }) },
  code_block: { block: 'code_block' },
  fence: {
    block: 'code_block',
    getAttrs: (tok: Token) => ({ params: tok.info || '' }),
  },
  hr: { node: 'horizontal_rule' },
  image: {
    node: 'image',
    getAttrs: (tok: Token) => ({
      src: tok.attrGet('src'),
      alt: tok.children?.[0]?.content ?? tok.attrGet('alt') ?? null,
      title: tok.attrGet('title') || null,
      width: tok.attrGet('width') ?? DEFAULT_IMAGE_WIDTH,
    }),
  },
  hardbreak: { node: 'hard_break' },

  math_inline: { block: 'math', noCloseToken: true },
  math_inline_double: { block: 'math', noCloseToken: true },
  math_block: { block: 'equation', noCloseToken: true },
  math_block_end: { ignore: true, noCloseToken: true },

  link: {
    mark: 'link',
    getAttrs: (tok: Token) => ({
      href: tok.attrGet('href'),
      title: tok.attrGet('title') || null,
    }),
  },

  i: { mark: 'em' },
  em: { mark: 'em' },

  b: { mark: 'strong' },
  strong: { mark: 'strong' },

  u: { mark: 'underline', noCloseToken: true },
  underline: { mark: 'underline', noCloseToken: true },

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

  container_directives: {
    block: 'callout',
    getAttrs: (tok: Token) => {
      const kind = tok.attrGet('kind') ?? '';
      const title = tok.attrGet('title') ?? '';
      return { kind, title };
    },
  },

  // myst_role: { mark: 'code', noCloseToken: true },
};

export function getMarkdownParser(schema: Schema) {
  const tokenizer = MyST();
  type Parser = { parse: (content: string) => ProsemirrorNode };
  const parser: Parser = new MarkdownParser(schema, tokenizer, tokens);
  return parser;
}

export function fromMarkdown(content: string, schema: Schema) {
  const doc = getMarkdownParser(schema).parse(content);
  return doc;
}
