import { UPDATE_EDITOR_STATE, INIT_EDITOR_STATE, SUBSCRIBE_EDITOR_VIEW, UNSUBSCRIBE_EDITOR_VIEW, RESET_ALL_EDITORS_AND_VIEWS, RESET_ALL_VIEWS, } from './types';
import { getEditorState, getEditorView } from './selectors';
import { opts } from '../../connect';
import { countState } from './utils';
export function initEditorState(useSchema, stateKey, editable, content, version) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: INIT_EDITOR_STATE,
        payload: {
            useSchema: useSchema, stateKey: stateKey, stateId: stateId, editable: editable, content: content, version: version,
        },
    };
}
export function updateEditorState(stateKey, viewId, editorState, tr) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    var counts = tr.docChanged ? countState(editorState) : null;
    return {
        type: UPDATE_EDITOR_STATE,
        payload: {
            stateId: stateId, viewId: viewId, editorState: editorState, counts: counts,
        },
    };
}
export function applyProsemirrorTransaction(stateKey, viewId, tr) {
    return function (dispatch, getState) {
        var view = getEditorView(getState(), viewId).view;
        if (view) {
            view.dispatch(tr);
            return true;
        }
        var editor = getEditorState(getState(), stateKey);
        if (editor.state == null)
            return true;
        var next = editor.state.apply(tr);
        dispatch(updateEditorState(stateKey, null, next, tr));
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
export function resetAllEditorsAndViews() {
    return {
        type: RESET_ALL_EDITORS_AND_VIEWS,
    };
}
export function resetAllViews() {
    return {
        type: RESET_ALL_VIEWS,
    };
}
//# sourceMappingURL=actions.js.map