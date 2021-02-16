import { UPDATE_EDITOR_STATE, INIT_EDITOR_STATE, SUBSCRIBE_EDITOR_VIEW, UNSUBSCRIBE_EDITOR_VIEW, } from './types';
import { getEditor } from './selectors';
import { opts } from '../../connect';
export function initEditorState(stateKey, editable, content, version) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: INIT_EDITOR_STATE,
        payload: {
            stateKey: stateKey, stateId: stateId, editable: editable, content: content, version: version,
        },
    };
}
export function updateEditorState(stateKey, viewId, editorState) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: UPDATE_EDITOR_STATE,
        payload: { stateId: stateId, viewId: viewId, editorState: editorState },
    };
}
export function applyProsemirrorTransaction(stateKey, tr) {
    return function (dispatch, getState) {
        var editor = getEditor(getState(), stateKey);
        if (editor.state == null)
            return true;
        var next = editor.state.apply(tr);
        dispatch(updateEditorState(stateKey, null, next));
        return true;
    };
}
export function subscribeView(stateKey, viewId, view) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: SUBSCRIBE_EDITOR_VIEW,
        payload: { stateId: stateId, viewId: viewId, view: view },
    };
}
export function unsubscribeView(stateKey, viewId) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: UNSUBSCRIBE_EDITOR_VIEW,
        payload: { stateId: stateId, viewId: viewId },
    };
}
//# sourceMappingURL=actions.js.map