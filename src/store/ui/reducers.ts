import { SELECT_EDITOR_VIEW, UIState, UIActionTypes, INLINE_SELECTION } from './types';

export const initialState: UIState = {
  stateId: null,
  viewId: null,
  selection: null,
};

const uiReducer = (state = initialState, action: UIActionTypes): UIState => {
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
    case INLINE_SELECTION: {
      if (state.selection === action.payload) return state;
      return {
        ...state,
        selection: action.payload,
      };
    }
    default:
      return state;
  }
};

export default uiReducer;
