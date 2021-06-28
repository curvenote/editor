var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { UPDATE_SUGGESTION, UPDATE_RESULTS, SELECT_SUGGESTION, } from './types';
var initialState = {
    view: null,
    trigger: '',
    range: { from: 0, to: 0 },
    open: false,
    kind: null,
    selected: 0,
    search: null,
    results: [],
};
var suggestionReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case UPDATE_SUGGESTION: {
            var _a = action.payload, open_1 = _a.open, kind = _a.kind, search = _a.search, range = _a.range, view = _a.view, trigger = _a.trigger;
            return __assign(__assign({}, state), { open: open_1, kind: kind, search: search, range: range, view: view, trigger: trigger, results: !open_1 ? [] : state.results });
        }
        case UPDATE_RESULTS: {
            var results = action.payload.results;
            return __assign(__assign({}, state), { results: results, selected: 0 });
        }
        case SELECT_SUGGESTION: {
            var selection = action.payload.selection;
            return __assign(__assign({}, state), { selected: selection });
        }
        default:
            return state;
    }
};
export default suggestionReducer;
//# sourceMappingURL=reducers.js.map