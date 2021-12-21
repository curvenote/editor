import { State, SuggestionResult } from '../types';

export const selectSuggestionState = (state: State) => state.editor.suggestion;
export const selectSuggestionKind = (state: State) => state.editor.suggestion.kind;
export const isSuggestionSelected = (state: State, index: number) =>
  state.editor.suggestion.selected === index;
export const isSuggestionOpen = (state: State) => state.editor.suggestion.open;

export function getSuggestionResults<T = SuggestionResult>(state: State) {
  return state.editor.suggestion.results as T[];
}
export function selectSuggestionView(state: State) {
  return state.editor.suggestion.view;
}
