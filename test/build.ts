/* eslint-disable import/no-extraneous-dependencies */
import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';
import { builders } from 'prosemirror-test-builder';
import * as src from '../src';

const schema = new Schema(src.schemas.presets.full);

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
  a: { markType: 'link', href: 'https://example.com' },
  callout: { nodeType: 'callout', kind: 'warning' },
  figureF: { nodeType: 'figure', id: 'my-figure' },
  figureT: { nodeType: 'figure', id: 'my-table' },
  figureC: { nodeType: 'figure', id: 'my-code' },
  figcaptionF: { nodeType: 'figcaption', kind: src.CaptionKind.fig },
  figcaptionT: { nodeType: 'figcaption', kind: src.CaptionKind.table },
  figcaptionE: { nodeType: 'figcaption', kind: src.CaptionKind.eq },
  figcaptionC: { nodeType: 'figcaption', kind: src.CaptionKind.code },
  variable: {
    nodeType: 'variable',
    name: 'x',
    value: '1',
    format: '.0f',
  },
  variableDerived: {
    nodeType: 'variable',
    name: 'y',
    valueFunction: 'x + 1',
    format: '.0f',
  },
  range: {
    nodeType: 'range',
    valueFunction: 'v',
    changeFunction: '{v: value}',
    min: '0',
    max: '10',
    step: '0.1',
  },
  dynamic: {
    nodeType: 'dynamic',
    valueFunction: 'v',
    changeFunction: '{v: value}',
    min: '0',
    max: '10',
    step: '0.1',
    format: '.0f',
  },
  math: { nodeType: 'math' },
  equation: { nodeType: 'equation' },
  equationNumbered: { nodeType: 'equation', id: 'my-equation', numbered: true },
  abbr: { nodeType: 'abbr', title: 'Cascading Style Sheets' },
  aside: { nodeType: 'aside' },
  underline: { nodeType: 'underline' },
  time: { nodeType: 'time', datetime: new Date('1759/09/22') }, // William Playfair's birthday!
  cite: { nodeType: 'cite', kind: src.ReferenceKind.cite, key: 'SimPEG2015' },
  citep: { nodeType: src.nodeNames.cite_group },
  code_block: { nodeType: 'code_block', language: 'python' },
  code_block_yaml: { nodeType: 'code_block', language: 'text/x-yaml' },
  code_block_text: { nodeType: 'code_block', language: 'text/plain' },
});

export const tdoc = (...args: Parameters<typeof tnodes.doc>) => tnodes.doc('', ...args);

export function compare(
  from: (text: string) => ProsemirrorNode,
  to: (doc: ProsemirrorNode) => string,
) {
  function parse(text: string, doc: ProsemirrorNode) {
    expect(from(text).toJSON()).toEqual(doc.toJSON());
  }

  function serialize(doc: ProsemirrorNode, text: string) {
    const ctx = ' oncontextmenu="return false;"';
    expect(to(doc).replace(ctx, '')).toEqual(text);
  }

  function same(text: string | { before: string; after: string }, doc: ProsemirrorNode) {
    const { before, after } = typeof text === 'string' ? { before: text, after: text } : text;
    parse(before, doc);
    serialize(doc, after);
  }
  return same;
}
