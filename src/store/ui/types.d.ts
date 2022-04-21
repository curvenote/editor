import { PopperPlacementType } from '@material-ui/core';
export declare const SELECT_EDITOR_VIEW = "SELECT_EDITOR_VIEW";
export declare const INLINE_SELECTION = "INLINE_SELECTION";
export declare enum SelectionKinds {
    link = "link",
    link_block = "link_block",
    figure = "figure",
    image = "image",
    iframe = "iframe",
    math = "math",
    equation = "equation",
    cite = "cite",
    citegroup = "citegroup",
    time = "time",
    heading = "heading",
    callout = "callout",
    table = "table",
    code = "code_block"
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
    selection: InlineSelection | null;
};
export interface SelectEditorViewAction {
    type: typeof SELECT_EDITOR_VIEW;
    payload: {
        stateId: string;
        viewId: string;
    };
}
export interface InlineSelectionAction {
    type: typeof INLINE_SELECTION;
    payload: InlineSelection | null;
}
export declare type UIActionTypes = SelectEditorViewAction | InlineSelectionAction;
