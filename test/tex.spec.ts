import { Node } from 'prosemirror-model';
import { FormatTypes } from '../src/serialize/tex/types';
import { tnodes, tdoc } from './build';
import { toTex } from '../src';

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
  link,
  br,
  img,
  abbr,
  subscript,
  superscript,
  math,
  equation,
  callout,
  aside,
} = tnodes;

const same = (text: string, doc: Node, format: FormatTypes = FormatTypes.tex) => {
  expect(toTex(doc, format)).toEqual(text);
};

const expectEnvironment = (name: string, doc: Node, format: FormatTypes = FormatTypes.tex) => {
  expect(toTex(doc, format)).toEqual(`\\begin{${name}}\n  hello!\n\\end{${name}}`);
};

describe('Tex', () => {
  it('serializes a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('serializes a callout', () => expectEnvironment('framed', tdoc(callout('hello!'))));
  it('serializes an ordered list', () =>
    same('\\begin{enumerate}\n  \\item hello\n\\end{enumerate}', tdoc(ol(li('hello')))));
  it('serializes an ordered list starting at "3"', () =>
    same('\\begin{enumerate}[resume]\n  \\item hello\n\\end{enumerate}', tdoc(ol3(li('hello')))));
  it('serializes an aside', () => same('\\marginpar{\n  hello!\n}', tdoc(aside('hello!'))));
  it('serializes a code_block', () => expectEnvironment('verbatim', tdoc(pre('hello!'))));
});

describe('Tex:curvenote', () => {
  it('serializes a callout', () =>
    expectEnvironment('callout', tdoc(callout('hello!')), FormatTypes.tex_curvenote));
  it('serializes an aside', () =>
    expectEnvironment('aside', tdoc(aside('hello!')), FormatTypes.tex_curvenote));
  it('serializes a code_block', () =>
    expectEnvironment('code', tdoc(pre('hello!')), FormatTypes.tex_curvenote));
});
