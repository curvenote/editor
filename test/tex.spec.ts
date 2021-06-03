import { Node } from 'prosemirror-model';
import { tnodes, tdoc } from './build';
import { toTex } from '../src';

const {
  blockquote, h1, h2, p, hr, li, ol, ol3, ul, pre, em, strong, code, code_block, a, link, br, img,
  abbr, subscript, superscript,
  math, equation, callout,
} = tnodes;

const same = (text: string, doc: Node) => {
  expect(toTex(doc)).toEqual(text);
};

describe('Tex', () => {
  it('serializes a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('serializes an ordered list', () => same('\\begin{enumerate}\n  \\item hello\n\\end{enumerate}', tdoc(ol(li('hello')))));
  it('serializes an ordered list starting at "3"', () => same('\\begin{enumerate}[resume]\n  \\item hello\n\\end{enumerate}', tdoc(ol3(li('hello')))));
});
