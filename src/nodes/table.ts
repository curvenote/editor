import { tableNodes } from 'prosemirror-tables';
import { Node } from 'prosemirror-model';
import { PhrasingContent, Table, TableCell, TableRow } from '../spec';
import { MdFormatSerialize, nodeNames, TexFormatSerialize, TexSerializerState } from '../types';
import { NodeGroups, Props } from './types';
import { writeDirectiveOptions } from '../serialize/markdown/utils';
import { indent } from '../serialize/indent';
import { writeMdastSnippet, getColumnWidths, hasFancyTable, renderPColumn } from './utils';

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
        // eslint-disable-next-line prefer-template
        if (value) attrs.style = (attrs.style || '') + `background-color: ${value};`;
      },
    },
  },
});

nodes.table.attrsFromMyst = () => ({});
nodes.table.toMyst = (props: Props): Table => {
  if (props.children?.length === 1 && props.children[0].type === 'table') {
    return props.children[0] as Table;
  }
  return { type: 'table', align: undefined, children: (props.children || []) as TableRow[] };
};

nodes.table_row.attrsFromMyst = () => ({});
nodes.table_row.toMyst = (props: Props): TableRow => ({
  type: 'tableRow',
  children: (props.children || []) as TableCell[],
});

function ifGreaterThanOne(num?: number): undefined | number {
  if (!num) return undefined;
  return num === 1 ? undefined : num;
}

nodes.table_header.attrsFromMyst = () => ({});
nodes.table_header.toMyst = (props: Props): TableCell => ({
  type: 'tableCell',
  header: true,
  align: props.align || undefined,
  colspan: ifGreaterThanOne(props.colspan),
  rowspan: ifGreaterThanOne(props.rowspan),
  children: (props.children || []) as PhrasingContent[],
});

nodes.table_cell.attrsFromMyst = () => ({});
nodes.table_cell.toMyst = (props: Props): TableCell => ({
  type: 'tableCell',
  header: undefined,
  align: props.align || undefined,
  colspan: ifGreaterThanOne(props.colspan),
  rowspan: ifGreaterThanOne(props.rowspan),
  children: (props.children || []) as PhrasingContent[],
});

/**
 * Create a "row" using a list-table
 * ```text
 * * - Col1
 *   - Col2
 * ```
 */
const renderListTableRow: MdFormatSerialize = (state, row) => {
  state.write('* ');
  const dedent = indent(state);
  row.content.forEach((cell) => {
    // TODO: make the lists tight!
    state.wrapBlock('  ', '- ', cell, () => {
      const { firstChild } = cell.content;
      if (firstChild?.type.name === 'paragraph' && firstChild.firstChild?.type.name === 'text') {
        firstChild.firstChild.text = firstChild.firstChild.text?.replace(/^\n+/, '\n');
      }
      return state.renderContent(cell);
    });
    // const atBlank = /(\n\n)$/.test(state.out as string);
    // if (state.options.tightLists && atBlank && state.out) {
    //   // Remove the trailing new line on `state.out` to make it tight
    //   state.out = state.out.replace(/\n\n$/, '');
    // }
  });
  dedent();
};

export const toListTable: MdFormatSerialize = (state, node, figure, index) => {
  // Use ~~~ for fence, as tables often have captions with roles/citations
  state.write('~~~{list-table}');
  if (state.nextTableCaption) {
    state.write(' ');
    state.renderInline(state.nextTableCaption);
  }
  state.ensureNewLine();
  const opts = { 'header-rows': 1, name: state.nextCaptionId };
  writeDirectiveOptions(state, opts);
  node.content.forEach((row) => {
    renderListTableRow(state, row, figure, index);
  });
  state.write('~~~');
  state.closeBlock(node);
};

export const toGFMMarkdownTable: MdFormatSerialize = (state, node) => {
  let rowIndex = 0;

  node.content.forEach((child) => {
    if (child.type.name === nodeNames.table_row) {
      let isHeader = false;
      let columnIndex = 0;
      state.write('| ');
      // Create a fake header and switch `|---|` code off below
      child.content.forEach((cell) => {
        if (columnIndex === 0 && rowIndex === 0) {
          if (cell.type.name === nodeNames.table_header) {
            // mark this row as header row to append header string after this row before the second row rendering
            isHeader = true;
          } else {
            // Creates placeholder header with header seperator
            // | Column 1 | Column 2 |
            // |---|---|
            let headerStr = '|';
            let counter = 0;
            child.content.forEach(() => {
              counter += 1;
              headerStr += `Column ${counter} |`;
            });
            headerStr += '\n|';
            child.content.forEach(() => {
              headerStr += '---|';
            });
            headerStr += '\n';
            state.write(headerStr);
          }
        }

        if (cell.type.name === nodeNames.table_cell || cell.type.name === nodeNames.table_header) {
          const columnCount = Number(cell.attrs.colspan);
          if (columnCount > 1) {
            // Duplicate the content across columns
            for (let i = 0; i < columnCount; i += 1) {
              cell.content.forEach((content) => {
                state.renderInline(content);
                state.write(' ');
              });
              state.write(' |');
            }
          } else {
            state.write(' ');
            cell.content.forEach((content) => {
              state.renderInline(content);
            });
            state.write(' |');
          }
        }
        columnIndex += 1;
      });
      if (isHeader) {
        isHeader = false;
        state.ensureNewLine();
        state.write('|');
        child.content.forEach((cell) => {
          if (cell.type.name === nodeNames.table_header) {
            state.write('---|');
          }
        });
      }
      state.ensureNewLine();
    }
    rowIndex += 1;
  });
  state.closeBlock(node);
};

function renderTableCell(
  state: TexSerializerState,
  cell: Node<any>,
  i: number,
  spanIdx: number,
  widths: number[],
  childCount: number,
) {
  let renderedSpan = 1;
  const {
    attrs: { colspan },
  } = cell;
  if (colspan > 1) {
    let width = 0;
    for (let j = 0; j < colspan; j += 1) {
      width += widths[spanIdx + j];
    }
    state.write(`\\multicolumn{${colspan}}{${renderPColumn(width)}}{`);
    renderedSpan = colspan;
  }
  if (cell.content.childCount === 1 && cell.content.child(0).type.name === nodeNames.paragraph) {
    // Render simple things inline, otherwise render a block
    state.renderInline(cell.content.child(0));
  } else {
    cell.content.forEach((content) => {
      state.render(content);
    });
  }
  if (colspan > 1) state.write('}');
  if (i < childCount - 1) {
    state.write(' & ');
  }
  return renderedSpan;
}

/**
 * convert prosemirror table node into latex table
 */
export function renderNodeToLatex(state: TexSerializerState, node: Node<any>) {
  const { widths, columnSpec, numColumns } = getColumnWidths(node);
  if (!numColumns) {
    throw new Error('invalid table format, no columns');
  }
  state.isInTable = true; // this is cleared at the end of this function
  state.ensureNewLine();

  // if not in a longtable environment already (these replace the figure environment)
  let dedent;
  // handle initial headers first
  let numHeaderRowsFound = 0;
  if (state.longFigure) {
    state.ensureNewLine();
    state.write('\\hline');
    state.ensureNewLine();
    let endHeader = false;
    // write the first header section
    node.content.forEach(({ content: rowContent }) => {
      if (endHeader) return;
      if (rowContent.firstChild?.type.name === nodeNames.table_header) {
        numHeaderRowsFound += 1;
        let spanIdx = 0;
        rowContent.forEach((cell, i) => {
          spanIdx += renderTableCell(state, cell, i, spanIdx, widths, rowContent.childCount);
        });
        state.write(' \\\\');
        state.ensureNewLine();
      }
      if (rowContent.firstChild?.type.name !== nodeNames.table_header) {
        endHeader = true;
      }
    });

    if (numHeaderRowsFound > 0) {
      state.ensureNewLine();
      state.write('\\hline');
      state.ensureNewLine();
      state.write('\\endfirsthead');
      state.ensureNewLine();

      state.write('\\hline');
      state.ensureNewLine();
      // write the continuation header section
      state.write(
        `\\multicolumn{${numColumns}}{c}{\\tablename\\ \\thetable\\ -- \\textit{Continued from previous page}}\\\\`,
      );
      state.ensureNewLine();
      node.content.forEach(({ content: rowContent }, offset, index) => {
        if (index >= numHeaderRowsFound) return;
        let spanIdx = 0;
        rowContent.forEach((cell, i) => {
          spanIdx += renderTableCell(state, cell, i, spanIdx, widths, rowContent.childCount);
        });
        state.write(' \\\\');
        state.ensureNewLine();
      });
      state.ensureNewLine();
      state.write('\\hline');
      state.ensureNewLine();
      state.write('\\endhead');
      state.ensureNewLine();
    }
  } else {
    state.write(`\\begin{tabular}{${columnSpec}}`);
    state.ensureNewLine();
    dedent = indent(state);
    state.write(`\\toprule`);
    state.ensureNewLine();
  }

  // todo: can we use offset and index to better handle row and column spans?
  node.content.forEach(({ content: rowContent }, offset, index) => {
    if (index < numHeaderRowsFound) return; // skip the header rows
    let spanIdx = 0;
    rowContent.forEach((cell, i) => {
      spanIdx += renderTableCell(state, cell, i, spanIdx, widths, rowContent.childCount);
    });
    state.write(' \\\\');
    state.ensureNewLine();
    // If the first cell in this row is a table header, make a line
    if (rowContent.firstChild?.type.name === nodeNames.table_header) {
      state.write('\\hline');
      state.ensureNewLine();
    }
  });

  if (state.longFigure) {
    state.write('\\hline');
  } else {
    state.write('\\bottomrule');
    state.ensureNewLine();
    dedent?.();
    state.write('\\end{tabular}');
  }
  state.closeBlock(node);
  state.isInTable = false;
}

export const toMarkdown: MdFormatSerialize = (state, node, figure, index) => {
  if (node && hasFancyTable(node)) {
    writeMdastSnippet(state, node);
    return;
  }
  toListTable(state, node, figure, index);
};

export const toTex: TexFormatSerialize = (state, node) => {
  try {
    renderNodeToLatex(state, node);
  } catch (e) {
    state.write(`{\\bf Error converting \`${node.type.name}' to \\LaTeX}`);
  }
};
