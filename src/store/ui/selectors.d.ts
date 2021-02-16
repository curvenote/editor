import { State } from '../types';
export declare function getEditorUI(state: State): import("./types").UIState;
export declare function getSelectedEditorAndViews(state: State): {
    state: null;
    views: never[];
    stateId?: undefined;
    viewIds?: undefined;
} | {
    state: import("prosemirror-state").EditorState<any>;
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
