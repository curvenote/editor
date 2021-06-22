export var getSuggestion = function (state) { return state.editor.suggestion; };
export var isSuggestionSelected = function (state, index) {
    return state.editor.suggestion.selected === index;
};
export var isSuggestionOpen = function (state) { return state.editor.suggestion.open; };
export function getSuggestionResults(state) {
    return state.editor.suggestion.results;
}
//# sourceMappingURL=selectors.js.map