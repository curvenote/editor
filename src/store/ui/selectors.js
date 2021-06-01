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
export function getEditorUIStateAndViewIds(state) {
    var _a = state.editor.ui, stateId = _a.stateId, viewId = _a.viewId;
    return { stateId: stateId, viewId: viewId };
}
export function isInlineActionOpen(state) {
    return state.editor.ui.selection != null;
}
export function getInlineActionAnchorEl(state) {
    var _a, _b;
    return (_b = (_a = state.editor.ui.selection) === null || _a === void 0 ? void 0 : _a.anchorEl) !== null && _b !== void 0 ? _b : null;
}
export function getInlineActionKind(state) {
    var _a, _b;
    return (_b = (_a = state.editor.ui.selection) === null || _a === void 0 ? void 0 : _a.kind) !== null && _b !== void 0 ? _b : null;
}
export function getInlineActionPlacement(state) {
    var _a, _b;
    return (_b = (_a = state.editor.ui.selection) === null || _a === void 0 ? void 0 : _a.placement) !== null && _b !== void 0 ? _b : 'bottom-start';
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