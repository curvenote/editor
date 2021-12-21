import { selectSuggestionState } from '../selectors';
export function chooseSelection(result) {
    return function (dispatch, getState) {
        var _a = selectSuggestionState(getState()), view = _a.view, _b = _a.range, from = _b.from, to = _b.to;
        if (!view)
            return;
        var schema = view.state.schema;
        var tr = view.state.tr;
        view.dispatch(tr.replaceRangeWith(from, to, schema.nodes.mention.create({ label: result.label, user: result.user })));
    };
}
//# sourceMappingURL=mention.js.map