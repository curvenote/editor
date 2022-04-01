import { toMyst, toMdast } from '../src/serialize';
import { getColumnWidths, TOTAL_TABLE_WIDTH, hasFancyTable } from '../src/nodes/utils';
import { tnodes, tdoc } from './build';

const { p, table, table_row, table_header, table_cell } = tnodes;

describe('tables.utils - general table handling', () => {
  describe('simple tables', () => {
    test('empty', () => {
      const node = table();
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(0);
      expect(widths).toEqual([]);
      expect(columnSpec).toEqual('');
      expect(hasFancyTable(node)).toBe(false);
    });
    test('one cell', () => {
      const node = table(table_row(table_cell(p('data 1'))));
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(1);
      expect(widths).toEqual([1]);
      expect(columnSpec).toEqual('p{\\dimexpr \\linewidth-2\\tabcolsep}');
    });
    test('two cells', () => {
      const node = table(table_row(table_cell(p('data 1')), table_cell(p('data 2'))));
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(2);
      expect(widths).toEqual([0.5, 0.5]);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.500\\linewidth-2\\tabcolsep}p{\\dimexpr 0.500\\linewidth-2\\tabcolsep}',
      );
    });
    test('two cells, two rows', () => {
      const node = table(
        table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
        table_row(table_cell(p('data 3')), table_cell(p('data 4'))),
      );
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(2);
      expect(widths).toEqual([0.5, 0.5]);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.500\\linewidth-2\\tabcolsep}p{\\dimexpr 0.500\\linewidth-2\\tabcolsep}',
      );
    });
    test('two cells, two rows with header', () => {
      const node = table(
        table_row(table_header(p('Col 1')), table_header(p('Col 1'))),
        table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
      );
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(2);
      expect(widths).toEqual([0.5, 0.5]);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.500\\linewidth-2\\tabcolsep}p{\\dimexpr 0.500\\linewidth-2\\tabcolsep}',
      );
    });
  });

  describe('tables with set widths', () => {
    test('two cols, only one width set', () => {
      const node = table(
        table_row(table_cell({ colwidth: [300] } as any, p('data 1')), table_cell(p('data 2'))),
      );
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(2);
      expect(widths[0]).toBeCloseTo(0.339);
      expect(widths[1]).toBeCloseTo(0.661);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.339\\linewidth-2\\tabcolsep}p{\\dimexpr 0.661\\linewidth-2\\tabcolsep}',
      );
    });

    test('two cols, uneven widths', () => {
      const node = table(
        table_row(
          table_cell({ colwidth: [100] } as any, p('data 1')),
          table_cell({ colwidth: [300] } as any, p('data 2')),
        ),
      );
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(2);
      expect(widths).toEqual([0.25, 0.75]);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.250\\linewidth-2\\tabcolsep}p{\\dimexpr 0.750\\linewidth-2\\tabcolsep}',
      );
    });
  });
  describe('tables with colspans', () => {
    test('one row, three cols', () => {
      const node = table(
        table_row(table_cell({ colspan: 2 } as any, p('data 1')), table_cell(p('data 2'))),
      );
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(3);
      expect(widths[0]).toBeCloseTo(0.333);
      expect(widths[1]).toBeCloseTo(0.333);
      expect(widths[2]).toBeCloseTo(0.333);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}',
      );
      expect(hasFancyTable(node)).toBe(true);
    });
    test('three rows, three cols', () => {
      const node = table(
        table_row(table_cell(p('data 1')), table_cell(p('data 2')), table_cell(p('data 3'))),
        table_row(table_cell({ colspan: 2 } as any, p('data 1')), table_cell(p('data 2'))),
        table_row(table_cell(p('data 2')), { colspan: 2 } as any, table_cell(p('data 3'))),
      );
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(3);
      expect(widths[0]).toBeCloseTo(0.333);
      expect(widths[1]).toBeCloseTo(0.333);
      expect(widths[2]).toBeCloseTo(0.333);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}',
      );
    });
    test('three rows, three cols spans in first row', () => {
      const node = table(
        table_row(table_cell({ colspan: 2 } as any, p('data 1')), table_cell(p('data 2'))),
        table_row(table_cell(p('data 1')), table_cell(p('data 2')), table_cell(p('data 3'))),
        table_row(table_cell(p('data 2')), { colspan: 2 } as any, table_cell(p('data 3'))),
      );
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(3);
      expect(widths[0]).toBeCloseTo(0.333);
      expect(widths[1]).toBeCloseTo(0.333);
      expect(widths[2]).toBeCloseTo(0.333);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}',
      );
    });
    test('three rows, two header, single spanning header cell in first row', () => {
      const node = table(
        table_row(table_header({ colspan: 3 } as any, p('full width'))),
        table_row(table_header(p('data 1')), table_header(p('data 2')), table_header(p('data 3'))),
        table_row(table_cell(p('data 2')), { colspan: 2 } as any, table_cell(p('data 3'))),
      );
      const { widths, columnSpec, numColumns } = getColumnWidths(node);
      expect(numColumns).toEqual(3);
      expect(widths[0]).toBeCloseTo(0.333);
      expect(widths[1]).toBeCloseTo(0.333);
      expect(widths[2]).toBeCloseTo(0.333);
      expect(columnSpec).toEqual(
        'p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}p{\\dimexpr 0.333\\linewidth-2\\tabcolsep}',
      );
    });
  });
});
