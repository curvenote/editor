import { State, SuggestionResult } from '../types';

export const getSuggestion = (state: State) => state.editor.suggestion;
export const isSuggestionSelected = (state: State, index: number) =>
  state.editor.suggestion.selected === index;
export const isSuggestionOpen = (state: State) => state.editor.suggestion.open;

export function getSuggestionResults<T = SuggestionResult>(state: State) {
  return state.editor.suggestion.results as T[];
}
