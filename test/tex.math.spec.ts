import { Node } from 'prosemirror-model';
import { TexFormatTypes } from '../src/serialize/types';
import { tnodes, tdoc } from './build';
import { toTex } from '../src';

const { p, math, equation } = tnodes;

const same = (text: string, doc: Node, format: TexFormatTypes = TexFormatTypes.tex) => {
  expect(toTex(doc, { format })).toEqual(text);
};

describe('Tex Math', () => {
  it('serializes symbolds in paragraphs', () =>
    same('Hello \\Leftrightarrow $\\delta\\pi$.', tdoc(p('Hello ⇔ δπ.'))));
  it('serializes symbolds in paragraphs', () =>
    same('$hi \\delta \\Leftrightarrow$', tdoc(math('hi δ ⇔'))));
  it('serializes symbolds in paragraphs', () =>
    same('\\begin{equation}\n\\delta here\n\\end{equation}', tdoc(equation('δ here'))));
  it('serializes greek', () => {
    same(
      '$A \\alpha B \\beta \\beta \\Gamma \\gamma \\Delta \\delta E \\epsilon Z \\zeta H \\eta \\Theta \\theta I \\iota K \\kappa \\Lambda \\lambda M \\mu N \\nu \\Xi \\xi O o \\Pi \\pi P \\rho \\Sigma \\sigma T \\tau \\Upsilon \\upsilon \\Phi \\phi \\varphi X \\chi \\Psi \\psi \\Omega \\omega$',
      tdoc(math('ΑαΒβßΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσΤτΥυΦϕφΧχΨψΩω')),
    );
  });
  it('serializes <>', () => same('Hello \\textless $< >$', tdoc(p('Hello < ', math('< >')))));
  it('serializes \\~}', () =>
    same('Hello {\\textbackslash}~{\\textasciitilde}\\}', tdoc(p('Hello \\ ~}'))));
});
