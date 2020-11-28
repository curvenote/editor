import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export const INIT_PROSEMIRROR_STATE = 'INIT_PROSEMIRROR_STATE';
export const SUBSCRIBE_PROSEMIRROR_VIEW = 'SUBSCRIBE_PROSEMIRROR_VIEW';
export const UNSUBSCRIBE_PROSEMIRROR_VIEW = 'UNSUBSCRIBE_PROSEMIRROR_VIEW';

export const UPDATE_PROSEMIRROR_STATE = 'UPDATE_PROSEMIRROR_STATE';

export const SELECT_EDITOR_VIEW = 'SELECT_EDITOR_VIEW';
export const FOCUS_EDITOR_VIEW = 'FOCUS_EDITOR_VIEW';


export type ProsemirrorUIState = {
  stateId: string | null;
  viewId: string | null;
  focused: boolean;
};


export type ProsemirrorState = {
  state: {
    [stateId: string]: {
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
  ui: ProsemirrorUIState;
};

export interface InitProsemirrorState {
  type: typeof INIT_PROSEMIRROR_STATE;
  payload: {
    stateId: string;
    editable: boolean;
    content: string;
    version: number;
  };
}

export interface UpdateProsemirrorState {
  type: typeof UPDATE_PROSEMIRROR_STATE;
  payload: {
    stateId: string;
    viewId: string | null;
    editorState: EditorState;
  };
}

export interface SubscribeProsemirrorView {
  type: typeof SUBSCRIBE_PROSEMIRROR_VIEW;
  payload: {
    stateId: string;
    viewId: string;
    view: EditorView;
  };
}

export interface UnsubscribeProsemirrorView {
  type: typeof UNSUBSCRIBE_PROSEMIRROR_VIEW;
  payload: {
    stateId: string;
    viewId: string;
  };
}


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
    stateId: string;
    viewId: string | null;
    focused: boolean;
  };
}


export type ProsemirrorActionTypes = (
  InitProsemirrorState |
  UpdateProsemirrorState |
  SubscribeProsemirrorView |
  UnsubscribeProsemirrorView |
  SelectEditorViewAction |
  FocusEditorViewAction
);
