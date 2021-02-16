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
import { opts } from '../../connect';
export function getEditor(state, stateKey) {
    if (stateKey == null)
        return { state: null, views: [] };
    var stateId = opts.transformKeyToId(stateKey);
    var editor = state.editor.state.editors[stateId !== null && stateId !== void 0 ? stateId : ''];
    if (!editor || !stateId)
        return { state: null, views: [] };
    var views = [];
    editor.viewIds.forEach(function (viewId) {
        var view = state.editor.state.views[viewId].view;
        views.push(view);
    });
    return {
        state: editor.state,
        views: views, stateId: stateId, viewIds: __spreadArrays(editor.viewIds),
    };
}
export function getEditorView(state, viewId) {
    var blank = { viewId: viewId, stateId: [], view: null };
    if (viewId == null)
        return blank;
    var view = state.editor.state.views[viewId];
    return __assign({ viewId: viewId }, (view !== null && view !== void 0 ? view : blank));
}
export function getEditorState(state, stateKey) {
    var blank = { state: null, viewIds: [] };
    var stateId = opts.transformKeyToId(stateKey);
    if (!stateId)
        return blank;
    var editor = state.editor.state.editors[stateId];
    return editor !== null && editor !== void 0 ? editor : blank;
}
//# sourceMappingURL=selectors.js.map