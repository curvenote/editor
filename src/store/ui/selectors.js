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
import { getEditorState, getEditorView } from '../state/selectors';
export function getEditorUI(state) {
    return state.editor.ui;
}
export function getSelectedView(state) {
    var viewId = getEditorUI(state).viewId;
    return getEditorView(state, viewId);
}
export function getSelectedEditorAndViews(state) {
    var _a = getEditorUI(state), stateId = _a.stateId, viewId = _a.viewId;
    return __assign(__assign(__assign({}, getEditorState(state, stateId)), getEditorView(state, viewId)), { viewId: viewId });
}
export function getSelectedViewId(state) {
    var _a = getEditorUI(state), stateId = _a.stateId, viewId = _a.viewId;
    return { stateId: stateId, viewId: viewId };
}
export function isEditorViewFocused(state, stateKey, viewId) {
    if (stateKey == null)
        return null;
    var stateId = opts.transformKeyToId(stateKey);
    var ui = state.editor.ui;
    return (ui.stateId === stateId
        && ui.viewId === viewId
        && ui.focused);
}
//# sourceMappingURL=selectors.js.map