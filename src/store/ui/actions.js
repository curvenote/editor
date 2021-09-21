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
import { SELECT_EDITOR_VIEW, FOCUS_EDITOR_VIEW, INLINE_SELECTION, SelectionKinds, } from './types';
import { getEditorUI, getSelectedEditorAndViews } from './selectors';
import { getEditorView } from '../state/selectors';
import { getSelectionKind } from './utils';
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
export function setInlineSelection(selection) {
    return {
        type: INLINE_SELECTION,
        payload: selection,
    };
}
export function positionInlineActions() {
    return function (dispatch, getState) {
        var _a;
        var _b = getSelectedEditorAndViews(getState()), viewId = _b.viewId, view = _b.view, state = _b.state;
        var selection = getSelectionKind(state);
        if (viewId == null || state == null || view == null || !selection) {
            dispatch(setInlineSelection(null));
            return;
        }
        var placement = {
            anchorEl: view.nodeDOM(selection.pos),
            placement: 'bottom-start',
        };
        var getAnchorEl = function (tag) {
            var _a, _b, _c;
            var anchorEl = placement.anchorEl;
            return ((_c = (_a = anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.getElementsByClassName('ProseMirror-node')[0]) !== null && _a !== void 0 ? _a : (_b = anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.getElementsByTagName) === null || _b === void 0 ? void 0 : _b.call(anchorEl, tag)[0]) !== null && _c !== void 0 ? _c : anchorEl);
        };
        switch (selection.kind) {
            case SelectionKinds.link:
                placement.anchorEl = (_a = view.nodeDOM(selection.pos)) === null || _a === void 0 ? void 0 : _a.parentElement;
                break;
            case SelectionKinds.image:
                placement.anchorEl = getAnchorEl('img');
                placement.placement = 'bottom';
                break;
            case SelectionKinds.iframe:
                placement.anchorEl = getAnchorEl('iframe');
                placement.placement = 'bottom';
                break;
            case SelectionKinds.callout:
                placement.placement = 'bottom';
                break;
            case SelectionKinds.table:
                placement.anchorEl = getAnchorEl('table');
                placement.placement = 'bottom';
                break;
            case SelectionKinds.equation:
                placement.placement = 'right';
                break;
            default:
                break;
        }
        dispatch(setInlineSelection(__assign(__assign({}, selection), placement)));
    };
}
//# sourceMappingURL=actions.js.map