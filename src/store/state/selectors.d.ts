import { State } from '../types';
export declare function getEditorView(state: State, viewId: string | null): {
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView;
    viewId: string;
};
export declare function getEditorState(state: State, stateKey: any | null): {
    key: any;
    state: import("prosemirror-state").EditorState;
    viewIds: string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter;
} | {
    key: null;
    state: null;
    viewIds: never[];
    counts: null;
};
