import { State, SuggestionResult, SuggestionKind } from '../types';

export function selectSuggestionState(state: State) {
  return state.editor.suggestion;
}
export const getSuggestionEditorState = (state: State) => state.editor.suggestion.editorState;
export const isSuggestionSelected = (state: State, index: number) =>
  state.editor.suggestion.editorState.selected === index;
export const isSuggestionOpen = (state: State) => state.editor.suggestion.editorState.open;

export function getSuggestionResults<T = SuggestionResult>(state: State) {
  return state.editor.suggestion.editorState.results as T[];
}
export function selectSuggestionView(state: State) {
  return state.editor.suggestion.editorState.view;
}

export function selectSuggestionData(state: State, kind: SuggestionKind) {
  return state.editor.suggestion.data[kind];
}
