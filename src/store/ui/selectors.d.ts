import { PopperPlacementType } from '@material-ui/core';
import { State } from '../types';
export declare function getEditorUI(state: State): import("./types").UIState;
export declare function getEditorUIStateAndViewIds(state: State): {
    stateId: string | null;
    viewId: string | null;
};
export declare function isInlineActionOpen(state: State): boolean;
export declare function getInlineActionAnchorEl(state: State): Element | null;
export declare function getInlineActionKind(state: State): import("./types").SelectionKinds | null;
export declare function getInlineActionPlacement(state: State): PopperPlacementType;
export declare function getSelectedView(state: State): {
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView<any>;
    viewId: string;
};
export declare function getSelectedEditorAndViews(state: State): {
    viewId: string | null;
    stateId: null;
    view: null;
    key: any;
    state: import("prosemirror-state").EditorState<import("prosemirror-model").Schema<"paragraph" | "text" | "display" | "dynamic" | "range" | "switch" | "button" | "variable" | "math" | "equation" | "cite" | "cite_group" | "aside" | "callout" | "iframe" | "table" | "table_row" | "table_cell" | "table_header" | "ordered_list" | "bullet_list" | "list_item" | "doc" | "heading" | "footnote" | "blockquote" | "code_block" | "figure" | "figcaption" | "image" | "horizontal_rule" | "hard_break" | "time", "link" | "code" | "em" | "strong" | "superscript" | "subscript" | "strikethrough" | "underline" | "abbr">>;
    viewIds: string[];
    counts: import("@curvenote/schema/dist/types").StateCounter;
} | {
    viewId: string | null;
    stateId: string;
    view: import("prosemirror-view").EditorView<any>;
    key: any;
    state: import("prosemirror-state").EditorState<import("prosemirror-model").Schema<"paragraph" | "text" | "display" | "dynamic" | "range" | "switch" | "button" | "variable" | "math" | "equation" | "cite" | "cite_group" | "aside" | "callout" | "iframe" | "table" | "table_row" | "table_cell" | "table_header" | "ordered_list" | "bullet_list" | "list_item" | "doc" | "heading" | "footnote" | "blockquote" | "code_block" | "figure" | "figcaption" | "image" | "horizontal_rule" | "hard_break" | "time", "link" | "code" | "em" | "strong" | "superscript" | "subscript" | "strikethrough" | "underline" | "abbr">>;
    viewIds: string[];
    counts: import("@curvenote/schema/dist/types").StateCounter;
} | {
    viewId: string | null;
    stateId: null;
    view: null;
    key: null;
    state: null;
    viewIds: never[];
    counts: null;
} | {
    viewId: string | null;
    stateId: string;
    view: import("prosemirror-view").EditorView<any>;
    key: null;
    state: null;
    viewIds: never[];
    counts: null;
};
export declare function getSelectedViewId(state: State): {
    stateId: string | null;
    viewId: string | null;
};
export declare function isEditorViewFocused(state: State, stateKey: any | null, viewId: string): boolean | null;
