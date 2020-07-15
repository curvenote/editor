import { JSDOM } from 'jsdom';
import { fromHTML, toHTML } from '../src/html';
import { Schema, nodes, marks } from '../src';
import { compare, tnodes, tdoc } from './build';
import { migrateHTML } from '../src/html/migrate';

const { document, DOMParser } = new JSDOM('').window;
const schema = new Schema({ nodes, marks });

const same = compare(
  (c) => fromHTML(c, schema, document, DOMParser),
  (doc) => toHTML(doc, schema, document),
);

const {
  blockquote, h1, h2, p, hr, li, ol, ol3, ul, pre, em, strong, code, a, link, br, img,
  variable, variableDerived, equation, equationInline,
  range, dynamic,
} = tnodes;

describe('HTML Upgrades', () => {
  it('upgrades and hoists variables', () => (
    same(
      migrateHTML('<p>hello</p><p><ink-var name="x" value="1" format=".0f"></ink-var>world</p>', document, DOMParser).innerHTML,
      tdoc(variable(), p('hello'), p('world')),
    )));
  it('upgrades equations', () => (
    same(
      migrateHTML('<p><ink-equation inline>y = mx + b</ink-equation></p>', document, DOMParser).innerHTML,
      tdoc(p('', equationInline('y = mx + b'))),
    )));
});

describe('HTML', () => {
  it('parses headings', () => (
    same(
      '<h1>one</h1><h2>two</h2><p>three</p>',
      tdoc(h1('one'), h2('two'), p('three')),
    )));
  it('parses variables', () => (
    same(
      '<r-var name="x" value="1" format=".0f"></r-var>',
      tdoc(variable()),
    )));
  it('parses derived variables', () => (
    same(
      '<r-var name="y" :value="x + 1" format=".0f"></r-var>',
      tdoc(variableDerived()),
    )));
  it('parses ranges', () => (
    same(
      '<p><r-range :value="v" :change="{v: value}" min="0" max="10" step="0.1"></r-range></p>',
      tdoc(p('', range())),
    )));
  it('parses dynamics', () => (
    same(
      '<p><r-dynamic :value="v" :change="{v: value}" format=".0f" min="0" max="10" step="0.1"></r-dynamic></p>',
      tdoc(p('', dynamic())),
    )));
  it('parses equations', () => (
    same(
      '<p><r-equation>y = mx + b</r-equation></p>',
      tdoc(p('', equation('y = mx + b'))),
    )));
  it('parses inline equations', () => (
    same(
      '<p><r-equation inline="">y = mx + b</r-equation></p>',
      tdoc(p('', equationInline('y = mx + b'))),
    )));
  it('does not parse scripts', () => (
    same(
      { before: '<script>alert("hi");</script>', after: '<p></p>' },
      tdoc(p()),
    )));
});
