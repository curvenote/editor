import { tableNodes } from 'prosemirror-tables';
import { nodeNames } from '../types';
import { FormatSerialize, NodeGroups } from './types';

type CellContent = {
  type: nodeNames.paragraph;
  content: { type: nodeNames.text; text: string }[];
};

interface TableCell {
  type: nodeNames.table_cell | nodeNames.table_header;
  attrs: any;
  content: CellContent[];
}

interface TableRow {
  type: nodeNames.table_row;
  content: TableCell[];
}

export interface TableJson {
  type: nodeNames.table;
  content: TableRow[];
}

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

function extractContentFromCell(cell: TableCell): string {
  return cell.content.map(({ content }) => content.map(({ text }) => text).join()).join();
}

export function serializeTableToMarkdown(nodeJson: TableJson) {
  let mdStr = '';
  let rowIndex = 0;
  nodeJson.content.forEach((child) => {
    if (child.type === nodeNames.table_row) {
      let isHeader = false;
      let rowStr = '|';

      let columnIndex = 0;
      child.content.forEach((cell) => {
        if (columnIndex === 0 && rowIndex === 0) {
          if (cell.type === nodeNames.table_header) {
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

        if (cell.type === nodeNames.table_cell || cell.type === nodeNames.table_header) {
          rowStr += ' ';
          // state.renderInline(cell);
          const cellContent = extractContentFromCell(cell);
          if (Number(cell.attrs.colspan) > 1) {
            rowStr += `${cellContent} |`.repeat(Number(cell.attrs.colspan));
          } else {
            rowStr += cellContent;
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
          if (cell.type === nodeNames.table_header) {
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
  return mdStr;
}

export const toMarkdown: FormatSerialize = (state, node) => {
  state.write(serializeTableToMarkdown(node.toJSON() as TableJson));
};

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
