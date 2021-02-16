import { SELECT_EDITOR_VIEW, FOCUS_EDITOR_VIEW } from './types';
import { getEditorUI } from './selectors';
import { getEditorView } from '../state/selectors';
export function selectEditorView(viewId) {
    return function (dispatch, getState) {
        var stateId = getEditorView(getState(), viewId).stateId;
        dispatch({
            type: SELECT_EDITOR_VIEW,
            payload: { stateId: stateId, viewId: viewId },
        });
    };
}
export function focusEditorView(viewId, focused) {
    return function (dispatch, getState) {
        var stateId = getEditorView(getState(), viewId).stateId;
        dispatch({
            type: FOCUS_EDITOR_VIEW,
            payload: { stateId: stateId, viewId: viewId, focused: focused },
        });
    };
}
export function focusSelectedEditorView(focused) {
    return function (dispatch, getState) {
        var viewId = getEditorUI(getState()).viewId;
        dispatch(focusEditorView(viewId, focused));
    };
}
//# sourceMappingURL=actions.js.map