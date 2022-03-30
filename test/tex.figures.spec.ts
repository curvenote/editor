import { Node } from 'prosemirror-model';
import { TexFormatTypes } from '../src/serialize/types';
import { tnodes, tdoc } from './build';
import { toTex } from '../src';

const { p, figureF, img, figcaptionF, table, table_row, table_header, table_cell } = tnodes;

const same = (text: string, doc: Node, format: TexFormatTypes = TexFormatTypes.tex) => {
  expect(toTex(doc, { format })).toEqual(text);
};

describe('Tex Figure', () => {
  test('serializes images as figures', () =>
    same(
      `\\begin{figure}[!htbp]
  \\centering
  \\includegraphics[width=0.7\\linewidth]{img.png}
\\end{figure}`,
      tdoc(figureF(img())),
    ));
  test('serializes images as figures with caption', () =>
    same(
      `\\begin{figure}[!htbp]
  \\centering
  \\includegraphics[width=0.7\\linewidth]{img.png}

  \\caption*{
    hello!
  }
\\end{figure}`,
      tdoc(figureF(img(), figcaptionF('hello!'))),
    ));

  describe('in tables', () => {
    test('images are not wrapped in figures', () => {
      same(
        `\\adjustbox{max width=\\textwidth}{%
\\begin{tabular}{*{2}{c}}
  \\hline
  A & B \\\\
  \\hline
  \\includegraphics[width=0.7\\linewidth]{img.png}

   & some text \\\\
  \\hline
\\end{tabular}}`,
        tdoc(
          table(
            table_row(table_header(p('A')), table_header(p('B'))),
            table_row(table_cell(p(img())), table_cell(p('some text'))),
          ),
        ),
      );
    });
    test('images with caption are not wrapped in figures', () => {
      same(
        `\\adjustbox{max width=\\textwidth}{%
\\begin{tabular}{*{2}{c}}
  \\hline
  A & B \\\\
  \\hline
  \\includegraphics[width=0.7\\linewidth]{img.png}

  hello!

   & some text \\\\
  \\hline
\\end{tabular}}`,
        tdoc(
          table(
            table_row(table_header(p('A')), table_header(p('B'))),
            table_row(table_cell(img(), figcaptionF('hello!')), table_cell(p('some text'))),
          ),
        ),
      );
    });
  });
});
