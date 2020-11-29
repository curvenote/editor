import {
  INIT_EDITOR_STATE, UPDATE_EDITOR_STATE,
  SUBSCRIBE_EDITOR_VIEW, UNSUBSCRIBE_EDITOR_VIEW,
  EditorActionTypes, EditorsState,
} from './types';
import { createEditorState } from '../../prosemirror';

export const initialState: EditorsState = {
  editors: {},
  views: {},
};

const editorReducer = (
  state = initialState,
  action: EditorActionTypes,
): EditorsState => {
  switch (action.type) {
    case INIT_EDITOR_STATE: {
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
    case SUBSCRIBE_EDITOR_VIEW: {
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
    case UNSUBSCRIBE_EDITOR_VIEW: {
      const {
        stateId, viewId,
      } = action.payload;
      const editor = state.editors[stateId];
      if (editor === undefined) throw new Error('Editor state has not been setup.');
      const newState: EditorsState = {
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
    case UPDATE_EDITOR_STATE: {
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

export default editorReducer;
