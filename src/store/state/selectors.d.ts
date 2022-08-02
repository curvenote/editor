import { StateCounter } from '@curvenote/schema/dist/types/types';
import { EditorState } from 'prosemirror-state';
import { State } from '../types';
export declare function selectEditors(state: State): {
    [stateId: string]: {
        key: any;
        state: EditorState;
        viewIds: string[];
        counts: StateCounter;
    };
};
export declare function selectViews(state: State): {
    [viewId: string]: {
        stateId: string;
        view: import("prosemirror-view").EditorView;
    };
};
export declare const selectEditorViewState: ((state: {
    editor: {
        state: import("./types").EditorsState;
        ui: import("../ui/types").UIState;
        suggestion: import("../suggestion/types").SuggestionState;
        attrs: import("../attrs/types").AttributesState;
    };
    runtime: {
        specs: import("@curvenote/runtime/dist/store/types").SpecsState;
        variables: import("@curvenote/runtime/dist/store/types").VariablesState;
        components: import("@curvenote/runtime/dist/store/types").ComponentsState;
    };
    sidenotes: {
        ui: import("sidenotes/dist/src/store/ui/types").UIState;
    };
}, params_0: string | null) => {
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView;
    viewId: string;
}) & import("reselect").OutputSelectorFields<(args_0: {
    [viewId: string]: {
        stateId: string;
        view: import("prosemirror-view").EditorView;
    };
}, args_1: string | null) => ({
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView;
    viewId: string;
}) & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectEditorState: (state: State, stateKey: any) => {
    key: any | null;
    state: EditorState | null;
    viewIds: string[] | [
    ];
    counts: StateCounter | null;
};
export declare const getEditorState: (state: State, stateKey: any) => {
    key: any | null;
    state: EditorState | null;
    viewIds: string[] | [
    ];
    counts: StateCounter | null;
};
export declare const getEditorView: ((state: {
    editor: {
        state: import("./types").EditorsState;
        ui: import("../ui/types").UIState;
        suggestion: import("../suggestion/types").SuggestionState;
        attrs: import("../attrs/types").AttributesState;
    };
    runtime: {
        specs: import("@curvenote/runtime/dist/store/types").SpecsState;
        variables: import("@curvenote/runtime/dist/store/types").VariablesState;
        components: import("@curvenote/runtime/dist/store/types").ComponentsState;
    };
    sidenotes: {
        ui: import("sidenotes/dist/src/store/ui/types").UIState;
    };
}, params_0: string | null) => {
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView;
    viewId: string;
}) & import("reselect").OutputSelectorFields<(args_0: {
    [viewId: string]: {
        stateId: string;
        view: import("prosemirror-view").EditorView;
    };
}, args_1: string | null) => ({
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView;
    viewId: string;
}) & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
