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
import { SELECT_EDITOR_VIEW, INLINE_SELECTION, SelectionKinds, } from './types';
import { getEditorUI, getInlineActionKind, getSelectedEditorAndViews } from './selectors';
import { getEditorView } from '../state/selectors';
import { getSelectionKind } from './utils';
export function updateSelectView(viewId) {
    return function (dispatch, getState) {
        var stateId = getEditorView(getState(), viewId).stateId;
        dispatch({
            type: SELECT_EDITOR_VIEW,
            payload: { stateId: stateId, viewId: viewId },
        });
    };
}
export var selectEditorView = updateSelectView;
export function focusEditorView(viewId, focused) {
    return function (dispatch, getState) {
        var view = getEditorView(getState(), viewId).view;
        if (!view)
            return;
        if (focused) {
            view.focus();
        }
        else {
            view.dom.blur();
        }
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
            var open_1 = getInlineActionKind(getState());
            if (open_1)
                dispatch(setInlineSelection(null));
            return;
        }
        var placement = {
            anchorEl: view.nodeDOM(selection.pos),
            placement: 'bottom-start',
        };
        var getAnchorEl = function (tag, container) {
            var _a, _b, _c, _d, _e;
            if (container === void 0) { container = false; }
            var anchorEl = placement.anchorEl;
            if (container)
                return (_b = (_a = anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.getElementsByTagName) === null || _a === void 0 ? void 0 : _a.call(anchorEl, tag)[0]) !== null && _b !== void 0 ? _b : anchorEl;
            return ((_e = (_c = anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.getElementsByClassName('ProseMirror-node')[0]) !== null && _c !== void 0 ? _c : (_d = anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.getElementsByTagName) === null || _d === void 0 ? void 0 : _d.call(anchorEl, tag)[0]) !== null && _e !== void 0 ? _e : anchorEl);
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
            case SelectionKinds.table:
                placement.anchorEl = getAnchorEl('table', true);
                placement.placement = 'bottom';
                break;
            case SelectionKinds.figure:
            case SelectionKinds.callout:
            case SelectionKinds.link_block:
            case SelectionKinds.code:
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