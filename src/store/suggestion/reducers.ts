import {
  SuggestionState, SuggestionActionTypes, UPDATE_SUGGESTION, UPDATE_RESULTS, SELECT_SUGGESTION,
} from './types';


const initialState: SuggestionState = {
  view: null,
  trigger: '',
  range: { from: 0, to: 0 },
  location: null,
  open: false,
  kind: null,
  selected: 0,
  search: null,
  results: [],
};

const suggestionReducer = (
  state = initialState,
  action: SuggestionActionTypes,
): SuggestionState => {
  switch (action.type) {
    case UPDATE_SUGGESTION: {
      const {
        location, open, kind, search, range, view, trigger,
      } = action.payload;
      return {
        ...state,
        location,
        open,
        kind,
        search,
        range,
        view,
        trigger,
      };
    }
    case UPDATE_RESULTS: {
      const { results } = action.payload;
      return {
        ...state,
        results,
        selected: 0, // Math.min(state.selected, results.length - 1),
      };
    }
    case SELECT_SUGGESTION: {
      const { selection } = action.payload;
      return {
        ...state,
        selected: selection,
      };
    }
    default:
      return state;
  }
};

export default suggestionReducer;
