import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export declare const INIT_EDITOR_STATE = "INIT_EDITOR_STATE";
export declare const SUBSCRIBE_EDITOR_VIEW = "SUBSCRIBE_EDITOR_VIEW";
export declare const UNSUBSCRIBE_EDITOR_VIEW = "UNSUBSCRIBE_EDITOR_VIEW";
export declare const RESET_ALL_EDITORS_AND_VIEWS = "RESET_ALL_EDITORS_AND_VIEWS";
export declare const UPDATE_EDITOR_STATE = "UPDATE_EDITOR_STATE";
export declare type EditorsState = {
    editors: {
        [stateId: string]: {
            key: any;
            state: EditorState;
            viewIds: string[];
        };
    };
    views: {
        [viewId: string]: {
            stateId: string;
            view: EditorView;
        };
    };
};
export interface InitEditorState {
    type: typeof INIT_EDITOR_STATE;
    payload: {
        stateKey: any;
        stateId: string;
        editable: boolean;
        content: string;
        version: number;
    };
}
export interface UpdateEditorState {
    type: typeof UPDATE_EDITOR_STATE;
    payload: {
        stateId: string;
        viewId: string | null;
        editorState: EditorState;
    };
}
export interface SubscribeEditorView {
    type: typeof SUBSCRIBE_EDITOR_VIEW;
    payload: {
        stateId: string;
        viewId: string;
        view: EditorView;
    };
}
export interface UnsubscribeEditorView {
    type: typeof UNSUBSCRIBE_EDITOR_VIEW;
    payload: {
        stateId: string;
        viewId: string;
    };
}
export interface ResetAllEditorsAndViews {
    type: typeof RESET_ALL_EDITORS_AND_VIEWS;
}
export declare type EditorActionTypes = (InitEditorState | UpdateEditorState | SubscribeEditorView | UnsubscribeEditorView | ResetAllEditorsAndViews);
