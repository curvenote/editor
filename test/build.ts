/* eslint-disable import/no-extraneous-dependencies */
import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { builders } from 'prosemirror-test-builder';
import * as src from '../src';

const schema = new Schema({ nodes: src.nodes, marks: src.marks });

export const tnodes = builders(schema, {
  p: { nodeType: 'paragraph' },
  h1: { nodeType: 'heading', level: 1 },
  h2: { nodeType: 'heading', level: 2 },
  hr: { nodeType: 'horizontal_rule' },
  li: { nodeType: 'list_item' },
  ol: { nodeType: 'ordered_list' },
  ol3: { nodeType: 'ordered_list', order: 3 },
  ul: { nodeType: 'bullet_list' },
  pre: { nodeType: 'code_block' },
  br: { nodeType: 'hard_break' },
  img: { nodeType: 'image', src: 'img.png', alt: 'x' },
  a: { markType: 'link', href: 'foo' },
  variable: {
    nodeType: 'var', name: 'x', value: '1', format: '.0f',
  },
  variableDerived: {
    nodeType: 'var', name: 'y', valueFunction: 'x + 1', format: '.0f',
  },
  range: {
    nodeType: 'range', valueFunction: 'v', changeFunction: '{v: value}', min: '0', max: '10', step: '0.1',
  },
  dynamic: {
    nodeType: 'dynamic', valueFunction: 'v', changeFunction: '{v: value}', min: '0', max: '10', step: '0.1', format: '.0f',
  },
  equation: { nodeType: 'equation' },
  equationBlock: { nodeType: 'equation_block' },
});

export const tdoc = (...args: Parameters<typeof tnodes.doc>) => tnodes.doc('', ...args);

export function compare(
  from: (text: string) => ProsemirrorNode, to: (doc: ProsemirrorNode) => string,
) {
  function parse(text: string, doc: ProsemirrorNode) {
    expect(from(text).toJSON()).toEqual(doc.toJSON());
  }

  function serialize(doc: ProsemirrorNode, text: string) {
    expect(to(doc)).toEqual(text);
  }

  function same(text: string | {before: string; after: string}, doc: ProsemirrorNode) {
    const { before, after } = typeof text === 'string' ? { before: text, after: text } : text;
    parse(before, doc);
    serialize(doc, after);
  }
  return same;
}
