// This is a placeholder for base-anchors
export const ANCHOR_BASE = 'ANCHOR_BASE';

export const UI_CONNECT_SIDENOTE = 'UI_CONNECT_SIDENOTE';
export const UI_DISCONNECT_SIDENOTE = 'UI_DISCONNECT_SIDENOTE';
export const UI_CONNECT_ANCHOR = 'UI_CONNECT_ANCHOR';
export const UI_CONNECT_ANCHOR_BASE = 'UI_CONNECT_ANCHOR_BASE';
export const UI_DISCONNECT_ANCHOR = 'UI_DISCONNECT_ANCHOR';
export const UI_SELECT_SIDENOTE = 'UI_SELECT_SIDENOTE';
export const UI_DESELECT_SIDENOTE = 'UI_DESELECT_SIDENOTE';
export const UI_SELECT_ANCHOR = 'UI_SELECT_ANCHOR';
export const UI_UPDATE_COMMENT = 'UI_UPDATE_COMMENT';
export const UI_REPOSITION_SIDENOTES = 'UI_REPOSITION_SIDENOTES';
export const UI_RESET_ALL_SIDENOTES = 'UI_RESET_ALL_SIDENOTES';

export type Sidenote = {
  id: string;
  baseAnchors: string[];
  inlineAnchors: string[];
  top: number;
  visible: boolean;
};

export type Anchor = {
  id: string;
  sidenote: typeof ANCHOR_BASE | string;
  element?: HTMLElement;
};

export type DocState = {
  id: string;
  selectedSidenote: string | null;
  selectedAnchor: string | null;
  sidenotes: Record<string, Sidenote>;
  anchors: Record<string, Anchor>;
};

export type UIState = {
  docs: Record<string, DocState>;
};

export interface ConnectSidenoteAction {
  type: typeof UI_CONNECT_SIDENOTE;
  payload: {
    docId: string;
    sidenoteId: string;
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

export interface ResetAllSidenotesAction {
  type: typeof UI_RESET_ALL_SIDENOTES;
}

export interface ConnectAnchorAction {
  type: typeof UI_CONNECT_ANCHOR;
  payload: {
    docId: string;
    sidenoteId: string;
    anchorId: string;
    element?: HTMLElement;
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

export interface DisconnectSidenoteAction {
  type: typeof UI_DISCONNECT_SIDENOTE;
  payload: {
    docId: string;
    sidenoteId: string;
  };
}

export interface SelectSidenoteAction {
  type: typeof UI_SELECT_SIDENOTE;
  payload: {
    docId: string;
    sidenoteId: string;
  };
}
export interface SelectAnchorAction {
  type: typeof UI_SELECT_ANCHOR;
  payload: {
    docId: string;
    anchorId: string;
  };
}
export interface DeselectSidenoteAction {
  type: typeof UI_DESELECT_SIDENOTE;
  payload: {
    docId: string;
  };
}
export interface RepositionSidenotesAction {
  type: typeof UI_REPOSITION_SIDENOTES;
  payload: {
    docId: string;
  };
}

export type UIActionTypes =
  | ConnectSidenoteAction
  | DisconnectSidenoteAction
  | ConnectAnchorAction
  | ConnectAnchorBaseAction
  | DisconnectAnchorAction
  | SelectSidenoteAction
  | SelectAnchorAction
  | DeselectSidenoteAction
  | RepositionSidenotesAction
  | ResetAllSidenotesAction;
