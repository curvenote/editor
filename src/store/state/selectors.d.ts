import { EditorView } from 'prosemirror-view';
import { State } from '../types';
export declare function getEditor(state: State, stateKey: any | null): {
    state: null;
    counts: null;
    views: never[];
    stateId?: undefined;
    viewIds?: undefined;
} | {
    state: import("prosemirror-state").EditorState<import("prosemirror-model").Schema<"paragraph" | "display" | "dynamic" | "range" | "switch" | "button" | "variable" | "math" | "equation" | "cite" | "cite_group" | "aside" | "callout" | "iframe" | "ordered_list" | "bullet_list" | "list_item" | "doc" | "text" | "heading" | "blockquote" | "code_block" | "image" | "horizontal_rule" | "hard_break" | "time", "link" | "code" | "em" | "strong" | "superscript" | "subscript" | "strikethrough" | "underline" | "abbr">>;
    counts: import("./utils").StateCounter;
    views: EditorView<any>[];
    stateId: string;
    viewIds: string[];
};
export declare function getEditorView(state: State, viewId: string | null): {
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: EditorView<any>;
    viewId: string;
};
export declare function getEditorState(state: State, stateKey: any | null): {
    key: any;
    state: import("prosemirror-state").EditorState<import("prosemirror-model").Schema<"paragraph" | "display" | "dynamic" | "range" | "switch" | "button" | "variable" | "math" | "equation" | "cite" | "cite_group" | "aside" | "callout" | "iframe" | "ordered_list" | "bullet_list" | "list_item" | "doc" | "text" | "heading" | "blockquote" | "code_block" | "image" | "horizontal_rule" | "hard_break" | "time", "link" | "code" | "em" | "strong" | "superscript" | "subscript" | "strikethrough" | "underline" | "abbr">>;
    viewIds: string[];
    counts: import("./utils").StateCounter;
} | {
    state: null;
    viewIds: never[];
    counts: null;
};
