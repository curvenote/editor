import {
  INIT_PROSEMIRROR_STATE, UPDATE_PROSEMIRROR_STATE,
  SUBSCRIBE_PROSEMIRROR_VIEW, UNSUBSCRIBE_PROSEMIRROR_VIEW,
  ProsemirrorActionTypes, ProsemirrorState, SELECT_EDITOR_VIEW, FOCUS_EDITOR_VIEW,
} from './types';
import { createEditorState } from '../../prosemirror';

export const initialState: ProsemirrorState = {
  state: {},
  views: {},
  ui: {
    stateId: null,
    viewId: null,
    focused: false,
  },
};

const prosemirrorReducer = (
  state = initialState,
  action: ProsemirrorActionTypes,
): ProsemirrorState => {
  switch (action.type) {
    case INIT_PROSEMIRROR_STATE: {
      const {
        stateId, content, editable, version,
      } = action.payload;
      if (state.state[stateId] !== undefined) return state;
      const editorState = createEditorState(content, version, editable);
      return {
        ...state,
        state: {
          ...state.state,
          [stateId]: {
            state: editorState, viewIds: [],
          },
        },
      };
    }
    case SUBSCRIBE_PROSEMIRROR_VIEW: {
      const {
        stateId, viewId, view,
      } = action.payload;
      const editor = state.state[stateId];
      if (editor === undefined) throw new Error('Editor state has not been setup.');
      return {
        ...state,
        state: {
          ...state.state,
          [stateId]: { ...editor, viewIds: [...editor.viewIds, viewId] },
        },
        views: {
          ...state.views,
          [viewId]: { stateId, view },
        },
      };
    }
    case UNSUBSCRIBE_PROSEMIRROR_VIEW: {
      const {
        stateId, viewId,
      } = action.payload;
      const editor = state.state[stateId];
      if (editor === undefined) throw new Error('Editor state has not been setup.');
      const newState: ProsemirrorState = {
        ...state,
        state: {
          ...state.state,
        },
        views: {
          ...state.views,
        },
      };
      Object.entries(newState.state).forEach(([k, entry]) => {
        const index = entry.viewIds.indexOf(viewId);
        if (index === -1) return;
        const viewIds = [...entry.viewIds];
        viewIds.splice(index, 1);
        newState.state[k] = {
          ...entry,
          viewIds,
        };
      });
      delete newState.views[viewId];
      return newState;
    }
    case UPDATE_PROSEMIRROR_STATE: {
      const { stateId, editorState } = action.payload;
      const editor = state.state[stateId];
      if (editor === undefined) throw new Error('Editor state has not been setup.');
      return {
        ...state,
        state: {
          ...state.state,
          [stateId]: {
            ...editor,
            state: editorState,
          },
        },
      };
    }
    case SELECT_EDITOR_VIEW: {
      const { stateId, viewId } = action.payload;
      return {
        ...state,
        ui: {
          ...state.ui,
          stateId,
          viewId,
        },
      };
    }
    case FOCUS_EDITOR_VIEW: {
      const { stateId, viewId, focused } = action.payload;
      const { ui } = state;
      if (ui.stateId === stateId && ui.viewId === viewId && ui.focused === focused) {
        // No change
        return state;
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          stateId,
          viewId,
          focused: focused && viewId != null && stateId != null,
        },
      };
    }
    default:
      return state;
  }
};

export default prosemirrorReducer;
