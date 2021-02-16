import { opts } from '../../connect';
import { getEditor, getEditorView } from '../state/selectors';
export function getEditorUI(state) {
    return state.editor.ui;
}
export function getSelectedEditorAndViews(state) {
    var stateId = getEditorUI(state).stateId;
    return getEditor(state, stateId);
}
export function getSelectedView(state) {
    var viewId = getEditorUI(state).viewId;
    return getEditorView(state, viewId);
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