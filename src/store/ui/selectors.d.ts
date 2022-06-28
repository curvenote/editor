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
    view: import("prosemirror-view").EditorView;
    viewId: string;
};
export declare function getSelectedEditorAndViews(state: State): {
    viewId: string | null;
    stateId: null;
    view: null;
    key: any;
    state: import("prosemirror-state").EditorState;
    viewIds: string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter;
} | {
    viewId: string | null;
    stateId: string;
    view: import("prosemirror-view").EditorView;
    key: any;
    state: import("prosemirror-state").EditorState;
    viewIds: string[];
    counts: import("@curvenote/schema/dist/types/types").StateCounter;
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
    view: import("prosemirror-view").EditorView;
    key: null;
    state: null;
    viewIds: never[];
    counts: null;
};
export declare function getSelectedViewId(state: State): {
    stateId: string | null;
    viewId: string | null;
};
export declare function isEditorViewFocused(state: State, viewId: string | null): boolean;
