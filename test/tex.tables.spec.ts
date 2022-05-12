import YAML from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { Node } from 'prosemirror-model';
import { TexFormatTypes } from '../src/serialize/types';
import { tnodes, tdoc } from './build';
import { toTex } from '../src';

const {
  p,
  figureF,
  figureT,
  img,
  figcaptionF,
  equation,
  table,
  table_row,
  table_header,
  table_cell,
  ul,
  li,
} = tnodes;

const same = (text: string, doc: Node, format: TexFormatTypes = TexFormatTypes.tex) => {
  expect(toTex(doc, { format })).toEqual(text);
};

describe.only('tex.tables', () => {
  let CASES: any;
  beforeAll(() => {
    CASES = YAML.load(fs.readFileSync(path.join(__dirname, 'tex.tables.yml'), 'utf8'));
  });

  it('a simple table', () => {
    same(
      CASES.simple.tex,
      tdoc(
        table(
          table_row(table_header(p('Col 1')), table_header(p('Col 1'))),
          table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
        ),
      ),
    );
  });
  it.only('a table with 3 columns and 3 rows', () => {
    same(
      CASES.threes.tex,
      tdoc(
        table(
          table_row(table_header(p('Col 1')), table_header(p('Col 2')), table_header(p('Col 3'))),
          table_row(table_cell(p('data 1')), table_cell(p('data 2')), table_cell(p('data 3'))),
          table_row(table_cell(p('data 1')), table_cell(p('data 2')), table_cell(p('data 3'))),
        ),
      ),
    );
  });
  it('a table with 4 columns and 4 rows', () => {
    same(
      CASES.fours.tex,
      tdoc(
        table(
          table_row(
            table_header(p('Col 1')),
            table_header(p('Col 2')),
            table_header(p('Col 3')),
            table_header(p('Col 4')),
          ),
          table_row(
            table_cell(p('data 1')),
            table_cell(p('data 2')),
            table_cell(p('data 3')),
            table_cell(p('data 4')),
          ),
          table_row(
            table_cell(p('data 1')),
            table_cell(p('data 2')),
            table_cell(p('data 3')),
            table_cell(p('data 4')),
          ),
        ),
      ),
    );
  });

  it('a table with an equation', () => {
    same(
      CASES.equation.tex,
      tdoc(
        table(
          table_row(table_header(p('Col 1')), table_header(equation('\\mu'))),
          table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
        ),
      ),
    );
  });
  it('a table with bullet lists', () =>
    same(
      CASES.bullets.tex,
      tdoc(
        table(
          table_row(table_header(p('Col 1')), table_header(equation('\\mu'))),
          table_row(table_cell(ul(li('hello'), li('world'))), table_cell(p('data 2'))),
        ),
      ),
    ));
  it('a table with a figure', () =>
    same(
      CASES.figure.tex,
      tdoc(
        table(
          table_row(table_header(p('Col 1')), table_header(p('An Image Figure'))),
          table_row(table_cell(p('data 1')), table_cell(figureF(img(), figcaptionF('hello!')))),
        ),
      ),
    ));
  describe('long tables', () => {
    test('basic', () => {
      same(
        CASES.longtable.tex,
        tdoc(
          figureT(
            { multipage: true } as any,
            table(
              table_row(table_header(p('Col 1')), table_header(p('Col 2'))),
              table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
            ),
          ),
        ),
      );
    });
    test('multiple header rows', () => {
      same(
        CASES.longtable_multi_header.tex,
        tdoc(
          figureT(
            { multipage: true } as any,
            table(
              table_row(table_header(p('1')), table_header(p('2'))),
              table_row(table_header(p('A')), table_header(p('B'))),
              table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
            ),
          ),
        ),
      );
    });
    test('multiple header rows with colspan', () => {
      same(
        CASES.longtable_multi_header_colspan.tex,
        tdoc(
          figureT(
            { multipage: true } as any,
            table(
              table_row({ colspan: 2 } as any, table_header(p('My Table'))),
              table_row(table_header(p('1')), table_header(p('2'))),
              table_row(table_header(p('A')), table_header(p('B'))),
              table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
            ),
          ),
        ),
      );
    });
    test('no header', () => {
      same(
        CASES.longtable_no_header.tex,
        tdoc(
          figureT(
            { multipage: true } as any,
            table(
              table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
              table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
              table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
            ),
          ),
        ),
      );
    });
  });
});
