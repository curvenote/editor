export var selectSuggestionState = function (state) { return state.editor.suggestion; };
export var selectSuggestionKind = function (state) { return state.editor.suggestion.kind; };
export var isSuggestionSelected = function (state, index) {
    return state.editor.suggestion.selected === index;
};
export var isSuggestionOpen = function (state) { return state.editor.suggestion.open; };
export function getSuggestionResults(state) {
    return state.editor.suggestion.results;
}
export function selectSuggestionView(state) {
    return state.editor.suggestion.view;
}
//# sourceMappingURL=selectors.js.map