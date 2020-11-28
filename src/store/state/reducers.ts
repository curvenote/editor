import {
  INIT_PROSEMIRROR_STATE, UPDATE_PROSEMIRROR_STATE,
  SUBSCRIBE_PROSEMIRROR_VIEW, UNSUBSCRIBE_PROSEMIRROR_VIEW,
  ProsemirrorActionTypes, ProsemirrorState,
} from './types';
import { createEditorState } from '../../prosemirror';

export const initialState: ProsemirrorState = {
  editors: {},
  views: {},
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
      if (state.editors[stateId] !== undefined) return state;
      const editorState = createEditorState(content, version, editable);
      return {
        ...state,
        editors: {
          ...state.editors,
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
      const editor = state.editors[stateId];
      if (editor === undefined) throw new Error('Editor state has not been setup.');
      return {
        ...state,
        editors: {
          ...state.editors,
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
      const editor = state.editors[stateId];
      if (editor === undefined) throw new Error('Editor state has not been setup.');
      const newState: ProsemirrorState = {
        ...state,
        editors: {
          ...state.editors,
        },
        views: {
          ...state.views,
        },
      };
      Object.entries(newState.editors).forEach(([k, entry]) => {
        const index = entry.viewIds.indexOf(viewId);
        if (index === -1) return;
        const viewIds = [...entry.viewIds];
        viewIds.splice(index, 1);
        newState.editors[k] = {
          ...entry,
          viewIds,
        };
      });
      delete newState.views[viewId];
      return newState;
    }
    case UPDATE_PROSEMIRROR_STATE: {
      const { stateId, editorState } = action.payload;
      const editor = state.editors[stateId];
      if (editor === undefined) throw new Error('Editor state has not been setup.');
      return {
        ...state,
        editors: {
          ...state.editors,
          [stateId]: {
            ...editor,
            state: editorState,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default prosemirrorReducer;
