// This is a placeholder for base-anchors to refer to a "comment"
export const COMMENT_ANCHOR_BASE = 'COMMENT_ANCHOR_BASE';

export const UI_CONNECT_COMMENT = 'UI_CONNECT_COMMENT';
export const UI_DISCONNECT_COMMENT = 'UI_DISCONNECT_COMMENT';
export const UI_CONNECT_ANCHOR = 'UI_CONNECT_ANCHOR';
export const UI_CONNECT_ANCHOR_BASE = 'UI_CONNECT_ANCHOR_BASE';
export const UI_DISCONNECT_ANCHOR = 'UI_DISCONNECT_ANCHOR';
export const UI_SELECT_COMMENT = 'UI_SELECT_COMMENT';
export const UI_DESELECT_COMMENT = 'UI_DESELECT_COMMENT';
export const UI_SELECT_ANCHOR = 'UI_SELECT_ANCHOR';
export const UI_UPDATE_COMMENT = 'UI_UPDATE_COMMENT';

export type Comment = {
  id: string;
  baseAnchors: string[];
  inlineAnchors: string[];
  top: number;
  visible: boolean;
};

export type Anchor = {
  id: string;
  element: HTMLElement;
  comment: typeof COMMENT_ANCHOR_BASE | string;
};

export type DocCommentState = {
  id: string;
  selectedComment: string | null;
  selectedAnchor: string | null;
  comments: Record<string, Comment>;
  anchors: Record<string, Anchor>;
};

export type UIState = {
  docs: Record<string, DocCommentState>;
};

export interface ConnectCommentAction {
  type: typeof UI_CONNECT_COMMENT;
  payload: {
    docId: string;
    commentId: string;
    baseId?: string;
  };
}

export interface DisconnectAnchorAction {
  type: typeof UI_DISCONNECT_ANCHOR;
  payload: {
    docId: string;
    anchorId: string;
  };
}

export interface ConnectAnchorAction {
  type: typeof UI_CONNECT_ANCHOR;
  payload: {
    docId: string;
    commentId: string;
    anchorId: string;
    element: HTMLElement;
  };
}

export interface ConnectAnchorBaseAction {
  type: typeof UI_CONNECT_ANCHOR_BASE;
  payload: {
    docId: string;
    anchorId: string;
    element: HTMLElement;
  };
}

export interface DisconnectCommentAction {
  type: typeof UI_DISCONNECT_COMMENT;
  payload: {
    docId: string;
    commentId: string;
  };
}

export interface SelectCommentAction {
  type: typeof UI_SELECT_COMMENT;
  payload: {
    docId: string;
    commentId: string;
  };
}
export interface SelectAnchorAction {
  type: typeof UI_SELECT_ANCHOR;
  payload: {
    docId: string;
    anchorId: string;
  };
}
export interface DeselectCommentAction {
  type: typeof UI_DESELECT_COMMENT;
  payload: {
    docId: string;
  };
}

export type UIActionTypes = (
  ConnectCommentAction |
  DisconnectCommentAction |
  ConnectAnchorAction |
  ConnectAnchorBaseAction |
  DisconnectAnchorAction |
  SelectCommentAction |
  SelectAnchorAction |
  DeselectCommentAction
);
