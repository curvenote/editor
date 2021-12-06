import {
  SuggestionState,
  SuggestionEditorState,
  SuggestionActionTypes,
  UPDATE_SUGGESTION,
  UPDATE_RESULTS,
  SELECT_SUGGESTION,
  UPDATE_SUGGESTION_DATA,
} from './types';

const INITIAL_EDITOR_STATE: SuggestionEditorState = {
  view: null,
  trigger: '',
  range: { from: 0, to: 0 },
  open: false,
  kind: null,
  selected: 0,
  search: null,
  results: [],
};

const suggestionState: SuggestionState = {
  editorState: INITIAL_EDITOR_STATE,
  data: {},
};

const suggestionReducer = (
  state = suggestionState,
  action: SuggestionActionTypes,
): SuggestionState => {
  switch (action.type) {
    case UPDATE_SUGGESTION: {
      const { open, kind, search, range, view, trigger } = action.payload;
      return {
        ...state,
        editorState: {
          ...state.editorState,
          open,
          kind,
          search,
          range,
          view,
          trigger,
          // Get rid of the previous results if closing!
          results: !open ? [] : state.editorState.results,
        },
      };
    }
    case UPDATE_RESULTS: {
      const { results } = action.payload;
      return {
        ...state,
        editorState: {
          ...state.editorState,
          results,
          selected: 0, // Math.min(state.selected, results.length - 1),
        },
      };
    }
    case UPDATE_SUGGESTION_DATA: {
      const { kind, data } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [kind]: data,
        },
      };
    }
    case SELECT_SUGGESTION: {
      const { selection } = action.payload;
      return {
        ...state,
        editorState: {
          ...state.editorState,
          selected: selection,
        },
      };
    }
    default:
      return state;
  }
};

export default suggestionReducer;
