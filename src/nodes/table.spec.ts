import { convertTableJsonToLatex, serializeTableToMarkdown, TableJson } from './table';

const tableWithColspanAndHeader: TableJson = {
  type: 'table',
  content: [
    {
      type: 'table_row',
      content: [
        {
          type: 'table_header',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header 1' }] }],
        },
        {
          type: 'table_header',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header 2' }] }],
        },
        {
          type: 'table_header',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header 3' }] }],
        },
      ],
    },
    {
      type: 'table_row',
      content: [
        {
          type: 'table_cell',
          attrs: { colspan: 2, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'this' }] }],
        },
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '3' }] }],
        },
      ],
    },
    {
      type: 'table_row',
      content: [
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '4' }] }],
        },
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '5' }] }],
        },
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '6' }] }],
        },
      ],
    },
  ],
};

const plainTable: TableJson = {
  type: 'table',
  content: [
    {
      type: 'table_row',
      content: [
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '1' }] }],
        },
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '2' }] }],
        },
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '3' }] }],
        },
      ],
    },
    {
      type: 'table_row',
      content: [
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '4' }] }],
        },
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '5' }] }],
        },
        {
          type: 'table_cell',
          attrs: { colspan: 1, rowspan: 1, colwidth: null, background: null },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '6' }] }],
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
      convertTableJsonToLatex({ type: 'table', content: [{ content: [], type: 'table_row' }] });
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
