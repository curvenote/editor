/* eslint-disable import/no-extraneous-dependencies */
import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { builders } from 'prosemirror-test-builder';
import isEqual from 'lodash.isequal';
import * as src from '../src';

const schema = new Schema({ nodes: src.nodes, marks: src.marks });

export const nodes = builders(schema, {
  p: { nodeType: 'paragraph' },
  h1: { nodeType: 'heading', level: 1 },
  h2: { nodeType: 'heading', level: 2 },
  hr: { nodeType: 'horizontal_rule' },
  li: { nodeType: 'list_item' },
  ol: { nodeType: 'ordered_list' },
  ol3: { nodeType: 'ordered_list', order: 3 },
  ul: { nodeType: 'bullet_list' },
  pre: { nodeType: 'code_block' },
  a: { markType: 'link', href: 'foo' },
  br: { nodeType: 'hard_break' },
  img: { nodeType: 'image', src: 'img.png', alt: 'x' },
});

export function compare(
  fromMarkdown: (text: string) => ProsemirrorNode, toMarkdown: (doc: ProsemirrorNode) => string,
) {
  function parse(text: string, doc: ProsemirrorNode) {
    isEqual(fromMarkdown(text).toJSON(), doc.toJSON());
  }

  function serialize(doc: ProsemirrorNode, text: string) {
    isEqual(toMarkdown(doc), text);
  }

  function same(text: string, doc: ProsemirrorNode) {
    parse(text, doc);
    serialize(doc, text);
  }
  return same;
}
