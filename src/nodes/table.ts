import { tableNodes } from 'prosemirror-tables';
import { FormatSerialize, NodeGroups } from './types';

export const nodes = tableNodes({
  tableGroup: NodeGroups.top,
  cellContent: NodeGroups.blockOrEquation,
  cellAttributes: {
    background: {
      default: null,
      getFromDOM(dom: any) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr(value: any, attrs: any) {
        // eslint-disable-next-line no-param-reassign, prefer-template
        if (value) attrs.style = (attrs.style || '') + `background-color: ${value};`;
      },
    },
  },
});

export const toMarkdown: FormatSerialize = (state, node) => {
  let mdStr = '';

  let rowIndex = 0;
  node.content.forEach((child) => {
    if (child.type.name === 'table_row') {
      let isHeader = false;
      let rowStr = '|';

      let columnIndex = 0;
      child.content.forEach((cell) => {
        if (columnIndex === 0 && rowIndex === 0) {
          if (cell.type.name === 'table_header') {
            // mark this row as header row to append header string after this row before the second row rendering
            isHeader = true;
          } else {
            // creates placeholder header with header seperateor
            let headerStr = '|';
            let counter = 0;
            child.content.forEach(() => {
              counter += 1;
              headerStr += `column ${counter} |`;
            });
            headerStr += '\n|';
            child.content.forEach(() => {
              headerStr += '---|';
            });
            headerStr += '\n';
            mdStr += headerStr;
          }
        }

        if (cell.type.name === 'table_cell' || cell.type.name === 'table_header') {
          rowStr += ' ';
          // state.renderInline(cell);
          if (Number(cell.attrs.colspan) > 1) {
            rowStr += `${cell.textContent} |`.repeat(Number(cell.attrs.colspan));
          } else {
            rowStr += cell.textContent;
            rowStr += ' |';
          }
        }
        columnIndex += 1;
      });
      rowStr += '\n';
      if (isHeader) {
        isHeader = false;
        rowStr += '|';
        child.content.forEach((cell) => {
          if (cell.type.name === 'table_header') {
            rowStr += '---|';
          }
        });
        rowStr += '\n';
      }
      mdStr += rowStr;
    }

    rowIndex += 1;
  });
  mdStr += `\n`;
  state.write(mdStr);
};

type CellContent = {
  type: 'paragraph';
  content: { type: 'text'; text: string }[];
};

interface TableCell {
  type: 'table_cell' | 'table_header';
  attrs: any;
  content: CellContent[];
}

interface TableRow {
  type: 'table_row';
  content: TableCell[];
}

export interface TableJson {
  type: 'table';
  content: TableRow[];
}

function extractContentFromCell(cell: TableCell): string {
  return cell.content.map(({ content }) => content.map(({ text }) => text).join()).join();
}
/**
 * convert prosemirror table node into latex table
 */
export function convertTableJsonToLatex(nodeJson: TableJson): string {
  const columLength = nodeJson.content[0].content.length;
  if (!columLength) {
    throw new Error('invalid table format');
  }
  let texStr = `\\begin{center}\n\\begin{tabular}{|${new Array(columLength)
    .fill('c')
    .join(' ')}|}\n \\hline\n`;

  nodeJson.content.forEach(({ content: rowContent, type: rowType }) => {
    let rowStr = ' ';
    const flatten = rowContent.map((cell) => {
      const {
        attrs: { colspan },
      } = cell;
      let cellStr = '';
      if (colspan > 1) {
        cellStr = `\\multicolumn{${colspan}}{ |c| }{${extractContentFromCell(cell)}}`;
      } else {
        cellStr = extractContentFromCell(cell);
      }
      return cellStr;
    });
    rowStr += flatten.join(' & ');
    rowStr += '\\\\\n \\hline\n';
    texStr += rowStr;
  });

  texStr += '\\end{tabular}\n\\end{center}\n';
  return texStr; // eslint-disable-line
}

export const toTex: FormatSerialize = (state, node) => {
  let result = '';
  try {
    result = convertTableJsonToLatex(node.toJSON() as TableJson);
  } catch (e) {
    state.write(`{\\bf Error converting \`${node.type.name}' to \\LaTeX}`);
  }
  state.write(result);
};
