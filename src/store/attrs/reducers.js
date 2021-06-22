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
import { ATTRIBUTES_SHOW_EDITOR } from './types';
var initialState = {
    show: false,
    pos: 0,
    location: { top: 0, left: 0 },
};
var AttributesReducer = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case ATTRIBUTES_SHOW_EDITOR: {
            var _a = action.payload, show = _a.show, location_1 = _a.location, pos = _a.pos;
            return __assign(__assign({}, state), { show: show,
                pos: pos,
                location: location_1 });
        }
        default:
            return state;
    }
};
export default AttributesReducer;
//# sourceMappingURL=reducers.js.map