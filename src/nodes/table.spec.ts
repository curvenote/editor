import { nodeNames } from '../types';
import { convertTableJsonToLatex, serializeTableToMarkdown, TableJson } from './table';

const tableWithColspanAndHeader: TableJson = {
  type: nodeNames.table,
  content: [
    {
      type: nodeNames.table_row,
      content: [
        {
          type: nodeNames.table_header,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [
            { type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: 'Header 1' }] },
          ],
        },
        {
          type: nodeNames.table_header,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [
            { type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: 'Header 2' }] },
          ],
        },
        {
          type: nodeNames.table_header,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [
            { type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: 'Header 3' }] },
          ],
        },
      ],
    },
    {
      type: nodeNames.table_row,
      content: [
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 2, rowspan: 1, colwidth: null, background: null },
          content: [
            { type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: 'this' }] },
          ],
        },
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '3' }] }],
        },
      ],
    },
    {
      type: nodeNames.table_row,
      content: [
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '4' }] }],
        },
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '5' }] }],
        },
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '6' }] }],
        },
      ],
    },
  ],
};

const plainTable: TableJson = {
  type: nodeNames.table,
  content: [
    {
      type: nodeNames.table_row,
      content: [
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '1' }] }],
        },
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '2' }] }],
        },
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '3' }] }],
        },
      ],
    },
    {
      type: nodeNames.table_row,
      content: [
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '4' }] }],
        },
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '5' }] }],
        },
        {
          type: nodeNames.table_cell,
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: nodeNames.paragraph, content: [{ type: nodeNames.text, text: '6' }] }],
        },
      ],
    },
  ],
};

describe('convertTableNodeToLatex', () => {
  test('should throw if table is emipty', () => {
    expect(() => {
      convertTableJsonToLatex({} as any);
    }).toThrow();
  });

  test('should throw if table column is empty', () => {
    expect(() => {
      convertTableJsonToLatex({
        type: nodeNames.table,
        content: [{ content: [], type: nodeNames.table_row }],
      });
    }).toThrow('invalid table format');
  });

  test('should convert a table with no col span and no heading', () => {
    expect(convertTableJsonToLatex(plainTable)).toBe(
      '\\begin{center}\n\\begin{tabular}{|c c c|}\n \\hline\n 1 & 2 & 3\\\\\n \\hline\n 4 & 5 & 6\\\\\n \\hline\n\\end{tabular}\n\\end{center}\n',
    );
  });

  test('should convert table with colspan and header correctly', () => {
    expect(convertTableJsonToLatex(tableWithColspanAndHeader)).toBe(
      '\\begin{center}\n\\begin{tabular}{|c c c|}\n \\hline\n Header 1 & Header 2 & Header 3\\\\\n \\hline\n \\multicolumn{2}{ |c| }{this} & 3\\\\\n \\hline\n 4 & 5 & 6\\\\\n \\hline\n\\end{tabular}\n\\end{center}\n',
    );
  });
});

describe('serializeTableToMarkdown', () => {
  test('should conver plain table to markdown table with placeholder header', () => {
    expect(serializeTableToMarkdown(plainTable)).toBe(
      '|column 1 |column 2 |column 3 |\n|---|---|---|\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |\n\n',
    );
  });
  test('should convert table with colspan and header correctly', () => {
    expect(serializeTableToMarkdown(plainTable)).toBe(
      '|column 1 |column 2 |column 3 |\n|---|---|---|\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |\n\n',
    );
  });
});
