import { nodeNames } from '@curvenote/schema/dist/types';
import { isInTable } from 'prosemirror-tables';
import { hasParentNode } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';

export enum CommandNames {
  'link' = 'link',
  'link_block' = 'link block',
  'callout' = 'callout',
  'aside' = 'aside',
  'math' = 'math',
  'equation' = 'equation',
  'horizontal_rule' = 'horizontal_rule',
  'bullet_list' = 'bullet_list',
  'ordered_list' = 'ordered_list',
  'emoji' = 'emoji',
  'paragraph' = 'paragraph',
  'heading1' = 'heading1',
  'heading2' = 'heading2',
  'heading3' = 'heading3',
  'heading4' = 'heading4',
  'heading5' = 'heading5',
  'heading6' = 'heading6',
  'code' = 'code',
  'quote' = 'quote',
  'footnote' = 'footnote',
  'time' = 'time',
  'variable' = 'variable',
  'display' = 'display',
  'range' = 'range',
  'dynamic' = 'dynamic',
  'switch' = 'switch',
  'button' = 'button',
  'youtube' = 'youtube',
  'loom' = 'loom',
  'vimeo' = 'vimeo',
  'miro' = 'miro',
  'iframe' = 'iframe',
  'add_citation' = 'add_citation',
  'citation' = 'citation',
  'link_article' = 'link_article',
  'link_notebook' = 'link_notebook',
  'link_section' = 'link_section',
  'link_figure' = 'link_figure',
  'link_equation' = 'link_equation',
  'link_code' = 'link_code',
  'link_table' = 'link_table',
  'image' = 'image',

  // Table
  'insert_table' = 'insert_table',
  'add_column_before' = 'add_column_before',
  'add_column_after' = 'add_column_after',
  'delete_column' = 'delete_column',
  'add_row_before' = 'add_row_before',
  'add_row_after' = 'add_row_after',
  'delete_row' = 'delete_row',
  'delete_table' = 'delete_table',
  'merge_cells' = 'merge_cells',
  'split_cell' = 'split_cell',
  'toggle_header_column' = 'toggle_header_column',
  'toggle_header_row' = 'toggle_header_row',
  'toggle_header_cell' = 'toggle_header_cell',
}

export interface CommandResult {
  name: CommandNames;
  title: string;
  description: string;
  image?: string;
  shortcut?: string | string[];
  available?: (view: EditorView) => boolean;
}

function nodeInSchema(nodeName: nodeNames) {
  return (view: EditorView) => {
    return view.state.schema.nodes[nodeName] !== undefined;
  };
}

// Do a fast `&&` across a list
function chain(...checks: ((view: EditorView) => boolean)[]) {
  return (view: EditorView) => {
    return checks.reduce((prev, check) => prev && check(view), true);
  };
}

// TODO: I think we could cache these, and it would speed things up
const onlyInTable = (view: EditorView) => isInTable(view.state);
const notInTable = (view: EditorView) => !isInTable(view.state);
const nonTopLevelNodes = new Set([
  nodeNames.callout,
  nodeNames.aside,
  nodeNames.blockquote,
  nodeNames.table,
]);
const onlyTopLevel = (view: EditorView) =>
  !hasParentNode((n) => nonTopLevelNodes.has(n.type.name as nodeNames))(view.state.selection);

const MATH_COMMAND: CommandResult = {
  name: CommandNames.math,
  title: 'Inline Math',
  description: 'Add some inline math!',
  shortcut: ['$$ Type $Ax=b$ or two dollar signs in a paragraph'],
  available: nodeInSchema(nodeNames.math),
};
const FOOTNOTE_COMMAND: CommandResult = {
  name: CommandNames.footnote,
  title: 'Footnote',
  description: 'Add a footnote',
  available: nodeInSchema(nodeNames.footnote),
};
const EMOJI_COMMAND: CommandResult = {
  name: CommandNames.emoji,
  title: 'Emoji',
  description: 'Add some emotion to your work 🎉',
  shortcut: [':'],
};
const ORDERED_LIST_COMMAND: CommandResult = {
  name: CommandNames.ordered_list,
  title: 'Numbered list',
  description: 'Insert an ordered list',
  shortcut: 'Mod-Shift-7',
  available: nodeInSchema(nodeNames.ordered_list),
};
const BULLET_LIST_COMMAND: CommandResult = {
  name: CommandNames.bullet_list,
  title: 'Bullet list',
  description: 'Insert an unordered list',
  shortcut: 'Mod-Shift-8',
  available: nodeInSchema(nodeNames.bullet_list),
};
const CITATION_COMMAND: CommandResult = {
  name: CommandNames.citation,
  title: 'Cite',
  description: 'Quickly reference a citation',
  shortcut: ['[[cite: To access existing ciations'],
  available: nodeInSchema(nodeNames.cite),
};

export const TABLE_COMMANDS: CommandResult[] = [
  {
    name: CommandNames.add_row_after,
    title: 'Add Row Below',
    description: 'Add a row after current cell',
    available: onlyInTable,
  },
  {
    name: CommandNames.add_row_before,
    title: 'Add Row Above',
    description: 'Add a row on the left of current cell',
    available: onlyInTable,
  },
  {
    name: CommandNames.add_column_after,
    title: 'Add Column Right',
    description: 'Add a column on the right of current cell',
    available: onlyInTable,
  },
  {
    name: CommandNames.add_column_before,
    title: 'Add Column Left',
    description: 'Add a column on the left of current cell',
    available: onlyInTable,
  },
  {
    name: CommandNames.delete_row,
    title: 'Delete Row',
    description: 'Delete the entire row',
    available: onlyInTable,
  },
  {
    name: CommandNames.delete_column,
    title: 'Delete Column',
    description: 'Delete the column the current cell belongs to',
    available: onlyInTable,
  },
  {
    name: CommandNames.toggle_header_row,
    title: 'Toggle Header Row',
    description: 'Toggle the current row to be a table header',
    available: onlyInTable,
  },
  {
    name: CommandNames.toggle_header_column,
    title: 'Toggle Header Column',
    description: 'Toggle the current column to be a table header',
    available: onlyInTable,
  },
  {
    name: CommandNames.delete_table,
    title: 'Delete Table',
    description: 'Delete the entire table',
    available: onlyInTable,
  },
];

const headerAvailable = chain(nodeInSchema(nodeNames.heading), notInTable);

export const HEADINGS: CommandResult[] = [
  {
    name: CommandNames.heading1,
    title: 'Heading 1',
    description: 'Insert the biggest header',
    shortcut: 'Mod-Alt-1',
    available: headerAvailable,
  },
  {
    name: CommandNames.heading2,
    title: 'Heading 2',
    description: 'Insert a big header',
    shortcut: 'Mod-Alt-2',
    available: headerAvailable,
  },
  {
    name: CommandNames.heading3,
    title: 'Heading 3',
    description: 'Insert a medium sized header',
    shortcut: 'Mod-Alt-3',
    available: headerAvailable,
  },
  {
    name: CommandNames.heading4,
    title: 'Heading 4',
    description: 'Insert a small header',
    shortcut: 'Mod-Alt-4',
    available: headerAvailable,
  },
  {
    name: CommandNames.heading5,
    title: 'Heading 5',
    description: 'Insert a tiny header',
    shortcut: 'Mod-Alt-5',
    available: headerAvailable,
  },
  {
    name: CommandNames.heading6,
    title: 'Heading 6',
    description: 'Insert a teensy-tiny header',
    shortcut: 'Mod-Alt-6',
    available: headerAvailable,
  },
];

export const ALL_COMMANDS: CommandResult[] = [
  // Put specific commands first, when they are active, they should be the first thing you see
  ...TABLE_COMMANDS,
  {
    name: CommandNames.callout,
    title: 'Callout Panel',
    description: 'Callout information in a panel',
    available: chain(nodeInSchema(nodeNames.callout), onlyTopLevel),
  },
  {
    name: CommandNames.aside,
    title: 'Aside',
    description: 'Add a section in the right-hand column',
    available: chain(nodeInSchema(nodeNames.aside), onlyTopLevel),
  },
  MATH_COMMAND,
  {
    name: CommandNames.image,
    title: 'Image',
    description: 'Insert or upload an image',
    // TODO: should this only be in the top level?
    available: nodeInSchema(nodeNames.image),
  },
  FOOTNOTE_COMMAND,
  {
    name: CommandNames.equation,
    title: 'Equation',
    description: 'Add a standalone math equation',
    shortcut: ['$$ Start the line with two dollar signs'],
    available: nodeInSchema(nodeNames.equation),
  },
  {
    name: CommandNames.horizontal_rule,
    title: 'Divider',
    description: 'Insert a horizontal rule',
    shortcut: ['--- Insert three -, ~, or * on a new line'],
    available: nodeInSchema(nodeNames.horizontal_rule),
  },
  ORDERED_LIST_COMMAND,
  BULLET_LIST_COMMAND,
  CITATION_COMMAND,
  {
    name: CommandNames.link_block,
    title: 'Link to block',
    description: 'Add a link to block',
  },
  {
    name: CommandNames.link_article,
    title: 'Link to Article',
    description: 'Add a link to an article',
    shortcut: ['[[article: Link to an article'],
  },
  {
    name: CommandNames.link_notebook,
    title: 'Link to Notebook',
    description: 'Add a link to an notebook',
    shortcut: ['[[nb: Link to a notebook'],
  },
  {
    name: CommandNames.link_section,
    title: 'Link to an internal Section',
    description: 'Add a link to title',
    shortcut: ['[[sec: Link to a section'],
  },
  {
    name: CommandNames.link_figure,
    title: 'Link to a figure or image',
    description: 'Add a link to figure',
    shortcut: ['[[fig: Link to a figure'],
  },
  {
    name: CommandNames.link_equation,
    title: 'Link to an internal equation',
    description: 'Add a link to equation',
    shortcut: ['[[eq: Link to an equation'],
  },
  {
    name: CommandNames.link_table,
    title: 'Link to an internal table',
    description: 'Add a link to table',
    shortcut: ['[[table: Link to a table'],
  },
  {
    name: CommandNames.link_code,
    title: 'Link to an internal program',
    description: 'Add a link to code block',
    shortcut: ['[[code: Link to program'],
  },
  {
    name: CommandNames.add_citation,
    title: 'Add Reference',
    description: 'Cite existing literature',
    available: nodeInSchema(nodeNames.cite),
  },
  EMOJI_COMMAND,
  {
    name: CommandNames.insert_table,
    title: 'Table',
    description: 'Creates a 2X2 Table',
    available: chain(nodeInSchema(nodeNames.table), onlyTopLevel),
  },
  {
    name: CommandNames.code,
    title: 'Code Block',
    description: 'Add a block of code',
    shortcut: ['```'],
    available: nodeInSchema(nodeNames.code_block),
  },
  {
    name: CommandNames.quote,
    title: 'Quote',
    description: 'Add a blockquote',
    shortcut: ['>'],
    available: nodeInSchema(nodeNames.blockquote),
  },
  {
    name: CommandNames.time,
    title: 'Date',
    description: 'Add a calendar date 📅',
    shortcut: ['//'],
    available: nodeInSchema(nodeNames.time),
  },
  {
    name: CommandNames.variable,
    title: 'Variable',
    description: 'Add a variable, make your document dynamic',
    shortcut: ['x='],
    available: chain(nodeInSchema(nodeNames.variable), onlyTopLevel),
  },
  {
    name: CommandNames.display,
    title: 'Display',
    description: 'Display a variable or expression',
    shortcut: ['{{'],
    available: nodeInSchema(nodeNames.display),
  },
  {
    name: CommandNames.range,
    title: 'Slider',
    description: 'Insert a slider over a range',
    shortcut: ['==x=='],
    available: nodeInSchema(nodeNames.range),
  },
  {
    name: CommandNames.dynamic,
    title: 'Dynamic Text',
    description: 'Insert dynamic text that acts as an inline slider',
    available: nodeInSchema(nodeNames.dynamic),
  },
  {
    name: CommandNames.switch,
    title: 'Inline Switch',
    description: 'Insert a switch for a boolean value',
    available: nodeInSchema(nodeNames.switch),
  },
  {
    name: CommandNames.button,
    title: 'Inline Button',
    description: 'Insert a button',
    available: nodeInSchema(nodeNames.button),
  },
  {
    name: CommandNames.paragraph,
    title: 'Paragraph',
    description: 'Turn header into a paragraph',
    shortcut: 'Mod-Alt-0',
    available: nodeInSchema(nodeNames.paragraph),
  },
  ...HEADINGS,
  {
    name: CommandNames.youtube,
    title: 'YouTube',
    description: 'Embed a video',
    available: nodeInSchema(nodeNames.iframe),
  },
  {
    name: CommandNames.vimeo,
    title: 'Vimeo',
    description: 'Embed a video',
    available: nodeInSchema(nodeNames.iframe),
  },
  {
    name: CommandNames.loom,
    title: 'Loom',
    description: 'Embed a video',
    available: nodeInSchema(nodeNames.iframe),
  },
  {
    name: CommandNames.miro,
    title: 'Miro',
    description: 'Embed a Miro board',
    available: nodeInSchema(nodeNames.iframe),
  },
  {
    name: CommandNames.iframe,
    title: 'IFrame',
    description: 'Embed an IFrame',
    available: nodeInSchema(nodeNames.iframe),
  },
];
