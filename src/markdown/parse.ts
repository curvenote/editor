import { Schema } from 'prosemirror-model';
import markdownit from 'markdown-it';
import markdownTexMath from 'markdown-it-texmath';
import Token from 'markdown-it/lib/token';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { MarkdownParser } from './from_markdown';

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

  math_inline: { block: 'equation', noOpenClose: true },
  math_inline_double: { block: 'equation', noOpenClose: true },
  math_block: { block: 'equation_block', noOpenClose: true },

  em: { mark: 'em' },
  strong: { mark: 'strong' },
  link: {
    mark: 'link',
    getAttrs: (tok: Token) => ({
      href: tok.attrGet('href'),
      title: tok.attrGet('title') || null,
    }),
  },
  code_inline: { mark: 'code' },
};

export function getMarkdownParser(schema: Schema) {
  const tokenizer = markdownit('commonmark', { html: false });
  tokenizer.use(markdownTexMath, {
    engine: null, // We are not going to render ever.
    delimiters: 'dollars',
  });
  return new MarkdownParser(schema, tokenizer, rules);
}
