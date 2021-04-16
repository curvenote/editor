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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { INIT_EDITOR_STATE, UPDATE_EDITOR_STATE, SUBSCRIBE_EDITOR_VIEW, UNSUBSCRIBE_EDITOR_VIEW, RESET_ALL_EDITORS_AND_VIEWS, } from './types';
import { createEditorState } from '../../prosemirror';
export var initialState = {
    editors: {},
    views: {},
};
var editorReducer = function (state, action) {
    var _a, _b, _c, _d;
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case INIT_EDITOR_STATE: {
            var _e = action.payload, stateKey = _e.stateKey, stateId = _e.stateId, content = _e.content, editable = _e.editable, version = _e.version;
            if (state.editors[stateId] !== undefined)
                return state;
            var editorState = createEditorState(stateKey, content, version, editable);
            return __assign(__assign({}, state), { editors: __assign(__assign({}, state.editors), (_a = {}, _a[stateId] = {
                    state: editorState, viewIds: [], key: stateKey,
                }, _a)) });
        }
        case SUBSCRIBE_EDITOR_VIEW: {
            var _f = action.payload, stateId = _f.stateId, viewId = _f.viewId, view = _f.view;
            var editor = state.editors[stateId];
            if (editor === undefined)
                throw new Error('Editor state has not been setup.');
            return __assign(__assign({}, state), { editors: __assign(__assign({}, state.editors), (_b = {}, _b[stateId] = __assign(__assign({}, editor), { viewIds: __spreadArrays(editor.viewIds, [viewId]) }), _b)), views: __assign(__assign({}, state.views), (_c = {}, _c[viewId] = { stateId: stateId, view: view }, _c)) });
        }
        case RESET_ALL_EDITORS_AND_VIEWS: {
            return __assign(__assign({}, state), { editors: {}, views: {} });
        }
        case UNSUBSCRIBE_EDITOR_VIEW: {
            var _g = action.payload, stateId = _g.stateId, viewId_1 = _g.viewId;
            var editor = state.editors[stateId];
            if (editor === undefined)
                throw new Error('Editor state has not been setup.');
            var newState_1 = __assign(__assign({}, state), { editors: __assign({}, state.editors), views: __assign({}, state.views) });
            Object.entries(newState_1.editors).forEach(function (_a) {
                var k = _a[0], entry = _a[1];
                var index = entry.viewIds.indexOf(viewId_1);
                if (index === -1)
                    return;
                var viewIds = __spreadArrays(entry.viewIds);
                viewIds.splice(index, 1);
                newState_1.editors[k] = __assign(__assign({}, entry), { viewIds: viewIds });
            });
            delete newState_1.views[viewId_1];
            return newState_1;
        }
        case UPDATE_EDITOR_STATE: {
            var _h = action.payload, stateId = _h.stateId, editorState = _h.editorState;
            var editor = state.editors[stateId];
            if (editor === undefined)
                throw new Error('Editor state has not been setup.');
            return __assign(__assign({}, state), { editors: __assign(__assign({}, state.editors), (_d = {}, _d[stateId] = __assign(__assign({}, editor), { state: editorState }), _d)) });
        }
        default:
            return state;
    }
};
export default editorReducer;
//# sourceMappingURL=reducers.js.map