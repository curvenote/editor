import {
  SELECT_EDITOR_VIEW, FOCUS_EDITOR_VIEW, UIState, UIActionTypes,
} from './types';

export const initialState: UIState = {
  stateId: null,
  viewId: null,
  focused: false,
};

const uiReducer = (
  state = initialState,
  action: UIActionTypes,
): UIState => {
  switch (action.type) {
    case SELECT_EDITOR_VIEW: {
      const { stateId, viewId } = action.payload;
      if (state.stateId === stateId && state.viewId === viewId) {
        // No change
        return state;
      }
      return {
        ...state,
        stateId,
        viewId,
      };
    }
    case FOCUS_EDITOR_VIEW: {
      const { stateId, viewId, focused } = action.payload;
      if (state.stateId === stateId && state.viewId === viewId && state.focused === focused) {
        // No change
        return state;
      }
      return {
        ...state,
        stateId,
        viewId,
        focused: focused && viewId != null && stateId != null,
      };
    }
    default:
      return state;
  }
};

export default uiReducer;
