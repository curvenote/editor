import { SELECT_EDITOR_VIEW, FOCUS_EDITOR_VIEW } from './types';
import { AppThunk } from '../types';
import { getEditorUI } from './selectors';
import { getEditorView } from '../state/selectors';

export function selectEditorView(viewId: string | null): AppThunk<void> {
  return (dispatch, getState) => {
    const { stateId } = getEditorView(getState(), viewId);
    dispatch({
      type: SELECT_EDITOR_VIEW,
      payload: { stateId, viewId },
    });
  };
}

export function focusEditorView(
  viewId: string | null, focused: boolean,
): AppThunk<void> {
  return (dispatch, getState) => {
    const { stateId } = getEditorView(getState(), viewId);
    dispatch({
      type: FOCUS_EDITOR_VIEW,
      payload: { stateId, viewId, focused },
    });
  };
}

export function focusSelectedEditorView(focused: boolean): AppThunk<void> {
  return (dispatch, getState) => {
    const { viewId } = getEditorUI(getState());
    dispatch(focusEditorView(viewId, focused));
  };
}
