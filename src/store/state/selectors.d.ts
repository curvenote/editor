import { EditorView } from 'prosemirror-view';
import { State } from '../types';
export declare function getEditor(state: State, stateKey: any | null): {
    state: null;
    views: never[];
    stateId?: undefined;
    viewIds?: undefined;
} | {
    state: import("prosemirror-state").EditorState<any>;
    views: EditorView<any>[];
    stateId: string;
    viewIds: string[];
};
export declare function getEditorView(state: State, viewId: string | null): {
    viewId: string | null;
    stateId: never[];
    view: null;
} | {
    stateId: string;
    view: EditorView<any>;
    viewId: string;
};
export declare function getEditorState(state: State, stateKey: any | null): {
    key: any;
    state: import("prosemirror-state").EditorState<any>;
    viewIds: string[];
} | {
    state: null;
    viewIds: never[];
};
