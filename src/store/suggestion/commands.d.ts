import { EditorView } from 'prosemirror-view';
export declare enum CommandNames {
    'link' = "link",
    'link_block' = "link block",
    'callout' = "callout",
    'aside' = "aside",
    'math' = "math",
    'equation' = "equation",
    'horizontal_rule' = "horizontal_rule",
    'bullet_list' = "bullet_list",
    'ordered_list' = "ordered_list",
    'emoji' = "emoji",
    'paragraph' = "paragraph",
    'heading1' = "heading1",
    'heading2' = "heading2",
    'heading3' = "heading3",
    'heading4' = "heading4",
    'heading5' = "heading5",
    'heading6' = "heading6",
    'code' = "code",
    'quote' = "quote",
    'footnote' = "footnote",
    'time' = "time",
    'variable' = "variable",
    'display' = "display",
    'range' = "range",
    'dynamic' = "dynamic",
    'switch' = "switch",
    'button' = "button",
    'youtube' = "youtube",
    'loom' = "loom",
    'vimeo' = "vimeo",
    'miro' = "miro",
    'iframe' = "iframe",
    'add_citation' = "add_citation",
    'citation' = "citation",
    'link_article' = "link_article",
    'link_notebook' = "link_notebook",
    'link_section' = "link_section",
    'link_figure' = "link_figure",
    'link_equation' = "link_equation",
    'link_code' = "link_code",
    'link_table' = "link_table",
    'image' = "image",
    'insert_table' = "insert_table",
    'add_column_before' = "add_column_before",
    'add_column_after' = "add_column_after",
    'delete_column' = "delete_column",
    'add_row_before' = "add_row_before",
    'add_row_after' = "add_row_after",
    'delete_row' = "delete_row",
    'delete_table' = "delete_table",
    'merge_cells' = "merge_cells",
    'split_cell' = "split_cell",
    'toggle_header_column' = "toggle_header_column",
    'toggle_header_row' = "toggle_header_row",
    'toggle_header_cell' = "toggle_header_cell"
}
export interface CommandResult {
    name: CommandNames;
    title: string;
    description: string;
    image?: string;
    shortcut?: string | string[];
    available?: (view: EditorView) => boolean;
}
export declare const TABLE_COMMANDS: CommandResult[];
export declare const HEADINGS: CommandResult[];
export declare const ALL_COMMANDS: CommandResult[];
