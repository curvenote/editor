import { State } from '../types';
export declare function getEditorUI(state: State): import("./types").UIState;
export declare function getSelectedEditorAndViews(state: State): {
    state: null;
    views: never[];
    stateId?: undefined;
    viewIds?: undefined;
} | {
    state: import("prosemirror-state").EditorState<import("prosemirror-model").Schema<"paragraph" | "variable" | "display" | "dynamic" | "range" | "switch" | "button" | "math" | "equation" | "cite" | "cite_group" | "aside" | "callout" | "iframe" | "ordered_list" | "bullet_list" | "list_item" | "doc" | "text" | "heading" | "blockquote" | "code_block" | "image" | "horizontal_rule" | "hard_break", "link" | "code" | "em" | "strong" | "superscript" | "subscript" | "strikethrough" | "underline" | "abbr">>;
    views: import("prosemirror-view").EditorView<any>[];
    stateId: string;
    viewIds: string[];
};
export declare function getSelectedView(state: State): {
    viewId: string | null;
    stateId: never[];
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView<any>;
    viewId: string;
};
export declare function getSelectedViewId(state: State): {
    stateId: string | null;
    viewId: string | null;
};
export declare function isEditorViewFocused(state: State, stateKey: any | null, viewId: string): boolean | null;
