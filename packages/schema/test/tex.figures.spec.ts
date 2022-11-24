import type { Node } from 'prosemirror-model';
import YAML from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { TexFormatTypes } from '../src/serialize/types';
import { tnodes, tdoc } from './build';
import { toTex } from '../src/serialize/tex';

const { p, figureF, figureT, img, figcaptionF, figcaptionT, table, table_row, table_cell } = tnodes;

const same = (text: string, doc: Node, format: TexFormatTypes = TexFormatTypes.tex) => {
  expect(toTex(doc, { format })).toEqual(text);
};

describe('Tex Figure', () => {
  let CASES: any;
  beforeAll(() => {
    CASES = YAML.load(fs.readFileSync(path.join(__dirname, 'tex.figures.yml'), 'utf8'));
  });

  test('serializes images as figures', () => same(CASES.images.tex, tdoc(figureF(img()))));
  test('serializes images as figures with caption', () =>
    same(CASES.images_with_caption.tex, tdoc(figureF(img(), figcaptionF('hello!')))));
  test('serializes tables as table environment', () =>
    same(
      CASES.table.tex,
      tdoc(
        figureT(
          { multipage: false } as any,
          table(table_row(table_cell(p('Col 1')), table_cell(p('An Image Figure')))),
        ),
      ),
    ));
  test('serializes long tables as longtable environment', () =>
    same(
      CASES.longtable.tex,
      tdoc(
        figureT(
          { multipage: true } as any,
          table(table_row(table_cell(p('Col 1')), table_cell(p('An Image Figure')))),
        ),
      ),
    ));
  test('serializes long tables as longtable environment with caption', () =>
    same(
      CASES.longtable_with_caption.tex,
      tdoc(
        figureT(
          { multipage: true } as any,
          figcaptionT('This is a caption'),
          table(table_row(table_cell(p('Col 1')), table_cell(p('An Image Figure')))),
        ),
      ),
    ));
  test('serializes images as figures', () =>
    same(CASES.images.tex, tdoc(figureF({ multipage: true } as any, img()))));
});
