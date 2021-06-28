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
import { SELECT_EDITOR_VIEW, FOCUS_EDITOR_VIEW, INLINE_SELECTION, } from './types';
export var initialState = {
    stateId: null,
    viewId: null,
    focused: false,
    selection: null,
};
var uiReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case SELECT_EDITOR_VIEW: {
            var _a = action.payload, stateId = _a.stateId, viewId = _a.viewId;
            if (state.stateId === stateId && state.viewId === viewId) {
                return state;
            }
            return __assign(__assign({}, state), { stateId: stateId, viewId: viewId });
        }
        case FOCUS_EDITOR_VIEW: {
            var _b = action.payload, stateId = _b.stateId, viewId = _b.viewId, focused = _b.focused;
            if (state.stateId === stateId && state.viewId === viewId && state.focused === focused) {
                return state;
            }
            return __assign(__assign({}, state), { stateId: stateId, viewId: viewId, focused: focused && viewId != null && stateId != null });
        }
        case INLINE_SELECTION: {
            return __assign(__assign({}, state), { selection: action.payload });
        }
        default:
            return state;
    }
};
export default uiReducer;
//# sourceMappingURL=reducers.js.map