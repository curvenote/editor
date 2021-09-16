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

  node.content.forEach((child) => {
    if (child.type.name === 'table_row') {
      let isHeader = false;
      mdStr += '|';
      child.content.forEach((cell) => {
        if (cell.type.name === 'table_header') {
          isHeader = true;
        }
        if (cell.type.name === 'table_cell' || cell.type.name === 'table_header') {
          mdStr += ' ';
          // state.renderInline(cell);
          if (Number(cell.attrs.colspan) > 1) {
            mdStr += `${cell.textContent} |`.repeat(Number(cell.attrs.colspan));
          } else {
            mdStr += cell.textContent;
            mdStr += ' |';
          }
        }
      });
      mdStr += '\n';
      if (isHeader) {
        mdStr += '|';
        child.content.forEach((cell) => {
          if (cell.type.name === 'table_header') {
            mdStr += '---|';
          }
        });
        mdStr += '\n';
      }
    }
  });
  state.write(mdStr);
  state.ensureNewLine();
};
export const toTex: FormatSerialize = (state, node) => {
  console.log('table toTex', node);
  state.write(`{\\bf \`${node.type.name}' not supported in \\LaTeX}`);
};
