import { Node } from 'prosemirror-model';
import { TexFormatTypes } from '../src/serialize/types';
import { tnodes, tdoc } from './build';
import { toTex } from '../src';

const { p, li, ol, ol3, pre, callout, aside, underline, cite, citep } = tnodes;

const same = (text: string, doc: Node, format: TexFormatTypes = TexFormatTypes.tex) => {
  expect(toTex(doc, { format })).toEqual(text);
};

const expectEnvironment = (
  name: string,
  doc: Node,
  format: TexFormatTypes = TexFormatTypes.tex,
) => {
  expect(toTex(doc, { format })).toEqual(`\\begin{${name}}\n  hello!\n\\end{${name}}`);
};

describe('Tex', () => {
  it('serializes a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('serializes underline', () => same('\\uline{hello! }', tdoc(p(underline('hello! ')))));
  it('serializes a callout', () => expectEnvironment('callout', tdoc(callout('hello!'))));
  it('serializes an ordered list', () =>
    same('\\begin{enumerate}\n  \\item hello\n\\end{enumerate}', tdoc(ol(li('hello')))));
  it('serializes an ordered list starting at "3"', () =>
    same('\\begin{enumerate}[resume]\n  \\item hello\n\\end{enumerate}', tdoc(ol3(li('hello')))));
  it('serializes an aside', () => expectEnvironment('aside', tdoc(aside('hello!'))));
  it('serializes a code_block', () => expectEnvironment('verbatim', tdoc(pre('hello!'))));
  it('serializes a citation', () => same('\\cite{SimPEG2015}', tdoc(p(cite()))));
  it('serializes a citation', () => same('\\citep{SimPEG2015}', tdoc(p(citep(cite())))));
  it('serializes a citation', () =>
    same('\\citep{SimPEG2015, SimPEG2015}', tdoc(p(citep(cite(), cite())))));
});

describe('Tex:curvenote - deprecated', () => {
  it('serializes a callout', () =>
    expectEnvironment('callout', tdoc(callout('hello!')), TexFormatTypes.tex_curvenote));
  it('serializes an aside', () =>
    expectEnvironment('aside', tdoc(aside('hello!')), TexFormatTypes.tex_curvenote));
  it('serializes a code_block', () =>
    expectEnvironment('verbatim', tdoc(pre('hello!')), TexFormatTypes.tex_curvenote));
});
