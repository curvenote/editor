declare const reducer: import("redux").Reducer<import("redux").CombinedState<{
    state: import(".").EditorsState;
    ui: import("./ui/types").UIState;
    suggestion: import("./suggestion/types").SuggestionState;
    attrs: import("./attrs/types").AttributesState;
}>, import("./types").EditorActions>;
export default reducer;
