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
import { createSelector } from '@reduxjs/toolkit';
import { opts } from '../../connect';
export function selectEditors(state) {
    return state.editor.state.editors;
}
export function selectViews(state) {
    return state.editor.state.views;
}
export var selectEditorViewState = createSelector([selectViews, function (_, viewId) { return viewId; }], function (views, viewId) {
    var blank = { viewId: viewId, stateId: null, view: null };
    if (viewId == null)
        return blank;
    var view = views[viewId];
    return __assign({ viewId: viewId }, (view !== null && view !== void 0 ? view : blank));
});
function makeSelectEditorState() {
    var selector = createSelector([selectEditors, function (_, stateKey) { return stateKey; }], function (editors, stateKey) {
        var blank = {
            key: null,
            state: null,
            viewIds: [],
            counts: null,
        };
        var stateId = opts.transformKeyToId(stateKey);
        if (!stateId)
            return blank;
        var editor = editors[stateId];
        return editor !== null && editor !== void 0 ? editor : blank;
    });
    return selector;
}
export var selectEditorState = makeSelectEditorState();
export var getEditorState = selectEditorState;
export var getEditorView = selectEditorViewState;
//# sourceMappingURL=selectors.js.map