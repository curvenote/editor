import { tnodes, tdoc } from './build';

const { p, table, table_row, table_header, table_cell } = tnodes;

const doc = tdoc(
  table(
    table_row(table_header(p('Col 1')), table_header(p('Col 1'))),
    table_row(table_cell(p('data 1')), table_cell(p('data 2'))),
  ),
);

console.log(JSON.stringify(doc, null, 4));
