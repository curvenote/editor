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
    /**
     * TODO:
     * - insert header if first row is not header like column 1,2,3,4 ...
     * - handle row span or probably not
     */
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
export const toTex: FormatSerialize = (state, node) => {
  console.log('table toTex', node);
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
};
