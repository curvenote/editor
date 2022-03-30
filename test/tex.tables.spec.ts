import { Node } from 'prosemirror-model';
import { TexFormatTypes } from '../src/serialize/types';
import { tnodes, tdoc } from './build';
import { toTex } from '../src';

const { p, equation, table, table_row, table_header, table_cell, ul, li } = tnodes;

const same = (text: string, doc: Node, format: TexFormatTypes = TexFormatTypes.tex) => {
  expect(toTex(doc, { format })).toEqual(text);
};

describe('Tex Tables', () => {
  it('serializes a simple table', () => {
    same(
      `\\adjustbox{max width=\\textwidth}{%
\\begin{tabular}{*{2}{c}}
  \\hline
  Col 1 & Col 1 \\\\
  \\hline
  data 1 & data 2 \\\\
  \\hline
\\end{tabular}}`,
      tdoc(
        table(
          table_row(table_header(p('Col 1')), table_header(p('Col 1'))),
          table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
        ),
      ),
    );
  });

  it('serializes a simple table', () => {
    same(
      `\\adjustbox{max width=\\textwidth}{%
\\begin{tabular}{*{2}{c}}
  \\hline
  Col 1 & \\(\\displaystyle \\mu \\) \\\\
  \\hline
  data 1 & data 2 \\\\
  \\hline
\\end{tabular}}`,
      tdoc(
        table(
          table_row(table_header(p('Col 1')), table_header(equation('\\mu'))),
          table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
        ),
      ),
    );
  });
  it('bullet lists are simple text bullets in a table', () =>
    same(
      `\\adjustbox{max width=\\textwidth}{%
\\begin{tabular}{*{2}{c}}
  \\hline
  Col 1 & \\(\\displaystyle \\mu \\) \\\\
  \\hline
  \\textbullet~~hello\\newline

  \\textbullet~~world\\newline

   & data 2 \\\\
  \\hline
\\end{tabular}}`,
      tdoc(
        table(
          table_row(table_header(p('Col 1')), table_header(equation('\\mu'))),
          table_row(table_cell(ul(li('hello'), li('world'))), table_cell(p('data 2'))),
        ),
      ),
    ));
});
