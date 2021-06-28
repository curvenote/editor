declare const reducer: import("redux").Reducer<import("redux").CombinedState<{
    state: import("./types").EditorsState;
    ui: import("./ui/types").UIState;
    suggestion: import("./suggestion/types").SuggestionState;
    attrs: import("./attrs/types").AttributesState;
}>, import("./types").EditorActionTypes | import("./ui/types").UIActionTypes | import("./suggestion/types").SuggestionActionTypes | import("./attrs/types").AttributesSetEditing>;
export default reducer;
