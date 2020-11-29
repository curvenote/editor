export const SELECT_EDITOR_VIEW = 'SELECT_EDITOR_VIEW';
export const FOCUS_EDITOR_VIEW = 'FOCUS_EDITOR_VIEW';

export type UIState = {
  stateId: string | null;
  viewId: string | null;
  focused: boolean;
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

export type UIActionTypes = (
  SelectEditorViewAction |
  FocusEditorViewAction
);
