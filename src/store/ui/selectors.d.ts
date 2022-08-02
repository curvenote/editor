import { PopperPlacementType } from '@material-ui/core';
import { State } from '../types';
export declare function getEditorUI(state: State): import("./types").UIState;
export declare const getEditorUIStateAndViewIds: ((state: {
    editor: {
        state: import("../types").EditorsState;
        ui: import("./types").UIState;
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
}) => {
    stateId: string | null;
    viewId: string | null;
}) & import("reselect").OutputSelectorFields<(args_0: import("./types").UIState) => {
    stateId: string | null;
    viewId: string | null;
} & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
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
    view: import("prosemirror-view").EditorView;
    viewId: string;
};
export declare function getSelectedEditorAndViews(state: State): {
    viewId: string | null;
    stateId: null;
    view: null;
    key: any;
    state: import("prosemirror-state").EditorState | null;
    viewIds: [] | string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter | null;
} | {
    viewId: string | null;
    stateId: string;
    view: import("prosemirror-view").EditorView;
    key: any;
    state: import("prosemirror-state").EditorState | null;
    viewIds: [] | string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter | null;
};
export declare const getSelectedViewId: ((state: {
    editor: {
        state: import("../types").EditorsState;
        ui: import("./types").UIState;
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
}) => {
    stateId: string | null;
    viewId: string | null;
}) & import("reselect").OutputSelectorFields<(args_0: import("./types").UIState) => {
    stateId: string | null;
    viewId: string | null;
} & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const isEditorViewFocused: ((state: {
    editor: {
        state: import("../types").EditorsState;
        ui: import("./types").UIState;
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
}, params_0: string | null) => boolean) & import("reselect").OutputSelectorFields<(args_0: {
    viewId: string | null;
    stateId: null;
    view: null;
} | {
    stateId: string;
    view: import("prosemirror-view").EditorView;
    viewId: string;
}) => boolean & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
