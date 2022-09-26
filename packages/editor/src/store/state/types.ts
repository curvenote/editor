import type { EditorState, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { types, schemas } from '@curvenote/schema';

export const REGISTER_EDITOR_STATE = 'REGISTER_EDITOR_STATE';
export const INIT_EDITOR_STATE = 'INIT_EDITOR_STATE';
export const SUBSCRIBE_EDITOR_VIEW = 'SUBSCRIBE_EDITOR_VIEW';
export const UNSUBSCRIBE_EDITOR_VIEW = 'UNSUBSCRIBE_EDITOR_VIEW';
export const RESET_ALL_EDITORS_AND_VIEWS = 'RESET_ALL_EDITORS_AND_VIEWS';
export const RESET_ALL_VIEWS = 'RESET_ALL_VIEWS';
export const RESET_EDITOR_AND_VIEWS = 'RESET_EDITOR_AND_VIEWS';

export const UPDATE_EDITOR_STATE = 'UPDATE_EDITOR_STATE';

export type EditorsState = {
  editors: {
    [stateId: string]: {
      key: any;
      state: EditorState;
      viewIds: string[];
      counts: types.StateCounter;
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
    useSchema: schemas.UseSchema;
    stateKey: any;
    stateId: string;
    editable: boolean;
    content: string;
    version: number;
  };
}

export interface RegisterEditorState {
  type: typeof REGISTER_EDITOR_STATE;
  payload: {
    stateKey: string;
    stateId: string;
    state: EditorState;
  };
}

export interface UpdateEditorState {
  type: typeof UPDATE_EDITOR_STATE;
  payload: {
    stateId: string;
    viewId: string | null;
    editorState: EditorState;
    counts: types.StateCounter | null;
    tr?: Transaction;
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

export interface ResetAllViews {
  type: typeof RESET_ALL_VIEWS;
}

export interface ResetEditorAndViews {
  type: typeof RESET_EDITOR_AND_VIEWS;
  payload: {
    stateId: string;
  };
}

export type EditorActionTypes =
  | InitEditorState
  | RegisterEditorState
  | UpdateEditorState
  | SubscribeEditorView
  | UnsubscribeEditorView
  | ResetAllEditorsAndViews
  | ResetAllViews
  | ResetEditorAndViews;
