import type { Node } from 'prosemirror-model';
import { tnodes, tdoc } from './build';
import { toText } from '../src';

const {
  blockquote,
  h1,
  h2,
  p,
  hr,
  li,
  ol,
  ol3,
  ul,
  pre,
  em,
  strong,
  code,
  code_block,
  a,
  br,
  img,
  abbr,
  subscript,
  superscript,
  math,
  equation,
  callout,
  aside,
  time,
} = tnodes;

const same = (text: string, doc: Node) => {
  expect(toText(doc)).toEqual(text);
};

describe('Text', () => {
  it('serializes a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('serializes a header', () =>
    same('hello!\n\nSub Header', tdoc(h1('hello!'), h2('Sub Header'))));
  it('serializes a breaks', () =>
    same('hello!\n\nSub Header', tdoc(h1('hello!'), br(), br(), br(), h2('Sub Header'))));
  it('serializes a hr', () =>
    same('hello!\n\nSub Header', tdoc(h1('hello!'), hr(), h2('Sub Header'))));
  it('serializes a link', () => same('link', tdoc(p(a('link')))));
  it('serializes a abbr', () => same('abbr', tdoc(p(abbr('abbr')))));
  it('serializes a abbr', () => same('abbr', tdoc(p(abbr('abbr')))));
  it('serializes a time', () => same('Sep 22, 1759', tdoc(p(time()))));
  it('serializes a callout', () => same('hello!', tdoc(callout('hello!'))));
  it('serializes a aside', () => same('hello!', tdoc(aside('hello!'))));
  it('serializes a blockquote', () => same('hello!', tdoc(blockquote('hello!'))));
  it('serializes a blockquote/code', () =>
    same('hello!\n\ncode!', tdoc(blockquote('hello!'), code('code!'))));
  it('serializes a blockquote/code_block', () =>
    same('hello!\n\ncode!', tdoc(blockquote('hello!'), code_block('code!'))));
  it('serializes a blockquote with emphasis', () =>
    same(
      'hi bold21',
      tdoc(blockquote(p(em('hi'), ' ', strong('bold'), subscript('2'), superscript('1')))),
    ));
  it('serializes a list', () =>
    same(
      '1. point 1\n2. point 2\n3. point 3',
      tdoc(blockquote(ol(li('point 1'), li('point 2'), li('point 3')))),
    ));
  it('serializes a list starting at 3', () =>
    same(
      '3. point 1\n4. point 2\n5. point 3',
      tdoc(blockquote(ol3(li('point 1'), li('point 2'), li('point 3')))),
    ));
  it('serializes a list', () =>
    same(
      '* point 1\n* point 2\n* point 3',
      tdoc(blockquote(ul(li('point 1'), li('point 2'), li('point 3')))),
    ));
  it('serializes a math', () => same('This is math x^2', tdoc(p('This is math ', math('x^2')))));
  it('serializes a equation', () =>
    same('This is an equation\n\nx^2', tdoc(p('This is an equation'), equation('x^2'))));
  it('serializes an image', () => same('', tdoc(img())));
});
