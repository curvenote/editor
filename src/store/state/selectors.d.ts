import { State } from '../types';
export declare function getEditorView(state: State, viewId: string | null): {
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView<any>;
    viewId: string;
};
export declare function getEditorState(state: State, stateKey: any | null): {
    key: any;
    state: import("prosemirror-state").EditorState<import("prosemirror-model").Schema<"aside" | "blockquote" | "button" | "cite" | "figcaption" | "figure" | "iframe" | "table" | "time" | "image" | "switch" | "text" | "paragraph" | "display" | "dynamic" | "range" | "variable" | "math" | "equation" | "cite_group" | "callout" | "link_block" | "table_row" | "table_cell" | "table_header" | "ordered_list" | "bullet_list" | "list_item" | "doc" | "heading" | "footnote" | "code_block" | "horizontal_rule" | "hard_break", "link" | "abbr" | "code" | "em" | "strong" | "superscript" | "subscript" | "strikethrough" | "underline">>;
    viewIds: string[];
    counts: import("@curvenote/schema/dist/types").StateCounter;
} | {
    key: null;
    state: null;
    viewIds: never[];
    counts: null;
};
