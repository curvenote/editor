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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { process } from '@curvenote/schema';
import { INIT_EDITOR_STATE, UPDATE_EDITOR_STATE, SUBSCRIBE_EDITOR_VIEW, UNSUBSCRIBE_EDITOR_VIEW, RESET_ALL_EDITORS_AND_VIEWS, RESET_ALL_VIEWS, } from './types';
import { createEditorState } from '../../prosemirror';
export var initialState = {
    editors: {},
    views: {},
};
var editorReducer = function (state, action) {
    var _a, _b, _c, _d;
    var _e;
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case INIT_EDITOR_STATE: {
            var _f = action.payload, useSchema = _f.useSchema, stateKey = _f.stateKey, stateId = _f.stateId, content = _f.content, editable = _f.editable, version = _f.version;
            if (state.editors[stateId] !== undefined)
                return state;
            var editorState = createEditorState(useSchema, stateKey, content, version, editable);
            var counts = process.countState(editorState);
            return __assign(__assign({}, state), { editors: __assign(__assign({}, state.editors), (_a = {}, _a[stateId] = {
                    state: editorState,
                    viewIds: [],
                    key: stateKey,
                    counts: counts,
                }, _a)) });
        }
        case SUBSCRIBE_EDITOR_VIEW: {
            var _g = action.payload, stateId = _g.stateId, viewId = _g.viewId, view = _g.view;
            var editor = state.editors[stateId];
            if (editor === undefined)
                throw new Error('Editor state has not been setup.');
            return __assign(__assign({}, state), { editors: __assign(__assign({}, state.editors), (_b = {}, _b[stateId] = __assign(__assign({}, editor), { viewIds: __spreadArray(__spreadArray([], editor.viewIds), [viewId]) }), _b)), views: __assign(__assign({}, state.views), (_c = {}, _c[viewId] = { stateId: stateId, view: view }, _c)) });
        }
        case RESET_ALL_EDITORS_AND_VIEWS: {
            return __assign(__assign({}, state), { editors: {}, views: {} });
        }
        case RESET_ALL_VIEWS: {
            return __assign(__assign({}, state), { editors: Object.fromEntries(Object.entries(state.editors).map(function (_a) {
                    var k = _a[0], editor = _a[1];
                    return [k, __assign(__assign({}, editor), { viewIds: [] })];
                })), views: {} });
        }
        case UNSUBSCRIBE_EDITOR_VIEW: {
            var _h = action.payload, stateId = _h.stateId, viewId_1 = _h.viewId;
            var editor = state.editors[stateId];
            if (editor === undefined)
                throw new Error('Editor state has not been setup.');
            var newState_1 = __assign(__assign({}, state), { editors: __assign({}, state.editors), views: __assign({}, state.views) });
            Object.entries(newState_1.editors).forEach(function (_a) {
                var k = _a[0], entry = _a[1];
                var index = entry.viewIds.indexOf(viewId_1);
                if (index === -1)
                    return;
                var viewIds = __spreadArray([], entry.viewIds);
                viewIds.splice(index, 1);
                newState_1.editors[k] = __assign(__assign({}, entry), { viewIds: viewIds });
            });
            delete newState_1.views[viewId_1];
            return newState_1;
        }
        case UPDATE_EDITOR_STATE: {
            var _j = action.payload, stateId = _j.stateId, editorState = _j.editorState, counts = _j.counts;
            var editor = state.editors[stateId];
            if (editor === undefined)
                throw new Error('Editor state has not been setup.');
            return __assign(__assign({}, state), { editors: __assign(__assign({}, state.editors), (_d = {}, _d[stateId] = __assign(__assign({}, editor), { state: editorState, counts: counts || ((_e = state.editors[stateId]) === null || _e === void 0 ? void 0 : _e.counts) || null }), _d)) });
        }
        default:
            return state;
    }
};
export default editorReducer;
//# sourceMappingURL=reducers.js.map