import type { UIState, UIActionTypes } from './types';
import { SELECT_BLOCK, SELECT_EDITOR_VIEW, INLINE_SELECTION } from './types';

export const initialState: UIState = {
  stateId: null,
  viewId: null,
  selection: null,
  selectedBlock: null,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
const uiReducer = (state = initialState, action: UIActionTypes): UIState => {
  switch (action.type) {
    case SELECT_BLOCK: {
      if (action.payload === state.selectedBlock) return state;
      return {
        ...state,
        selectedBlock: action.payload,
      };
    }
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
