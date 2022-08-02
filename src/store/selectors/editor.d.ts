import { MarkType, NodeType } from 'prosemirror-model';
import { ContentNodeWithPos } from 'prosemirror-utils1';
import { State } from '../types';
export declare const getParentsOfSelection: ((state: {
    editor: {
        state: import("../types").EditorsState;
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
}, params_0: string | null) => ContentNodeWithPos[]) & import("reselect").OutputSelectorFields<(args_0: {
    key: any;
    state: import("prosemirror-state").EditorState | null;
    viewIds: [] | string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter | null;
}, args_1: string | null) => ContentNodeWithPos[] & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const getNodeAttrs: ((state: {
    editor: {
        state: import("../types").EditorsState;
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
}, params_0: string | null, params_1: number) => import("prosemirror-model").Attrs | null) & import("reselect").OutputSelectorFields<(args_0: {
    key: any;
    state: import("prosemirror-state").EditorState | null;
    viewIds: [] | string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter | null;
}, args_1: number) => import("prosemirror-model").Attrs & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const menuActive: ((state: {
    editor: {
        state: import("../types").EditorsState;
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
}, params_0: {}) => boolean) & import("reselect").OutputSelectorFields<(args_0: {
    key: any;
    state: import("prosemirror-state").EditorState | null;
    viewIds: [] | string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter | null;
}) => boolean & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectionIsMarkedWith: ((state: {
    editor: {
        state: import("../types").EditorsState;
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
}, params_0: string | null, params_1: {
    [x: string]: MarkType | undefined;
}) => Record<string, boolean>) & import("reselect").OutputSelectorFields<(args_0: {
    key: any;
    state: import("prosemirror-state").EditorState | null;
    viewIds: [] | string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter | null;
}, args_1: Record<string, MarkType | undefined>) => Record<string, boolean> & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare const selectionIsChildOf: ((state: {
    editor: {
        state: import("../types").EditorsState;
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
}, params_0: string | null, params_1: {
    [x: string]: NodeType | undefined;
}) => Record<string, boolean>) & import("reselect").OutputSelectorFields<(args_0: {
    key: any;
    state: import("prosemirror-state").EditorState | null;
    viewIds: [] | string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter | null;
}, args_1: Record<string, NodeType | undefined>) => Record<string, boolean> & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
export declare function selectionIsChildOfActiveState<T extends Record<string, any>>(state: State, nodes: Record<keyof T, NodeType | undefined>): Record<string, boolean>;
export declare const selectionIsThisNodeType: ((state: {
    editor: {
        state: import("../types").EditorsState;
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
}, params_0: string | null, params_1: {
    [x: string]: NodeType | undefined;
}) => Record<string, boolean>) & import("reselect").OutputSelectorFields<(args_0: {
    key: any;
    state: import("prosemirror-state").EditorState | null;
    viewIds: [] | string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter | null;
}, args_1: Record<string, NodeType | undefined>) => Record<string, boolean> & {
    clearCache: () => void;
}> & {
    clearCache: () => void;
};
