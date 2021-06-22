import { UPDATE_EDITOR_STATE } from './types';
var updateProsemirrorViewsMiddleware = function (store) { return function (next) { return function (action) {
    var result = next(action);
    if (action.type === UPDATE_EDITOR_STATE) {
        var _a = action.payload, stateId = _a.stateId, viewId_1 = _a.viewId, editorState_1 = _a.editorState;
        var state = store.getState().editor.state.editors[stateId];
        var views_1 = store.getState().editor.state.views;
        if (state == null)
            return result;
        state.viewIds.forEach(function (id) {
            var _a;
            if (id === viewId_1)
                return;
            (_a = views_1[id]) === null || _a === void 0 ? void 0 : _a.view.updateState(editorState_1);
        });
    }
    return result;
}; }; };
export default [updateProsemirrorViewsMiddleware];
//# sourceMappingURL=middleware.js.map