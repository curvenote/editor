import { Node } from 'prosemirror-model';
import { tnodes, tdoc } from './build';
import { toMarkdown } from '../src';

const { p, li, ol, ol3, ul, underline, cite, citep } = tnodes;

const same = (text: string, doc: Node) => {
  expect(toMarkdown(doc)).toEqual(text);
};

describe('MyST', () => {
  it('serializes a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('serializes underline', () => same('{u}`hello! `', tdoc(p(underline('hello! ')))));
  it('serializes a bullet list', () =>
    same('- hello\n- world', tdoc(ul(li('hello'), li('world')))));
  it('serializes an ordered list', () => same('1. hello', tdoc(ol(li('hello')))));
  it('serializes an ordered list', () => same('3. hello', tdoc(ol3(li('hello')))));
  it('serializes a citation', () => same('{cite:t}`SimPEG2015`', tdoc(p(cite()))));
  it('serializes a citation', () => same('{cite:p}`SimPEG2015`', tdoc(p(citep(cite())))));
  it('serializes a citation', () =>
    same('{cite:p}`SimPEG2015; SimPEG2015`', tdoc(p(citep(cite(), cite())))));
});
