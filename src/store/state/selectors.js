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
import { opts } from '../../connect';
export function getEditorView(state, viewId) {
    var blank = { viewId: viewId, stateId: null, view: null };
    if (viewId == null)
        return blank;
    var view = state.editor.state.views[viewId];
    return __assign({ viewId: viewId }, (view !== null && view !== void 0 ? view : blank));
}
export function getEditorState(state, stateKey) {
    var blank = {
        key: null, state: null, viewIds: [], counts: null,
    };
    var stateId = opts.transformKeyToId(stateKey);
    if (!stateId)
        return blank;
    var editor = state.editor.state.editors[stateId];
    return editor !== null && editor !== void 0 ? editor : blank;
}
//# sourceMappingURL=selectors.js.map