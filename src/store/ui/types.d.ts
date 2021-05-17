import { PopperPlacementType } from '@material-ui/core';
export declare const SELECT_EDITOR_VIEW = "SELECT_EDITOR_VIEW";
export declare const FOCUS_EDITOR_VIEW = "FOCUS_EDITOR_VIEW";
export declare const INLINE_SELECTION = "INLINE_SELECTION";
export declare enum SelectionKinds {
    link = "link",
    image = "image",
    iframe = "iframe",
    math = "math",
    equation = "equation",
    cite = "cite",
    citegroup = "citegroup",
    time = "time",
    heading = "heading",
    callout = "callout"
}
export declare type InlineSelection = {
    kind: SelectionKinds;
    pos: number;
    anchorEl: Element | HTMLElement | null | undefined;
    placement: PopperPlacementType;
};
export declare type UIState = {
    stateId: string | null;
    viewId: string | null;
    focused: boolean;
    selection: InlineSelection | null;
};
export interface SelectEditorViewAction {
    type: typeof SELECT_EDITOR_VIEW;
    payload: {
        stateId: string;
        viewId: string;
    };
}
export interface FocusEditorViewAction {
    type: typeof FOCUS_EDITOR_VIEW;
    payload: {
        stateId: string | null;
        viewId: string | null;
        focused: boolean;
    };
}
export interface InlineSelectionAction {
    type: typeof INLINE_SELECTION;
    payload: InlineSelection | null;
}
export declare type UIActionTypes = (SelectEditorViewAction | FocusEditorViewAction | InlineSelectionAction);
