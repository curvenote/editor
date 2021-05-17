import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';
import { opts } from '../connect';
import { createEditorView } from '../prosemirror';
import { actions, selectors, } from '../store';
var Editor = function (props) {
    var stateKey = props.stateKey, viewId = props.viewId, className = props.className, autoUnsubscribe = props.autoUnsubscribe;
    var dispatch = useDispatch();
    var editorEl = useRef(null);
    var editorView = useRef();
    var editorState = useSelector(function (state) { var _a; return (_a = selectors.getEditorState(state, stateKey)) === null || _a === void 0 ? void 0 : _a.state; });
    var focused = useSelector(function (state) { return (selectors.isEditorViewFocused(state, stateKey, viewId)); });
    useEffect(function () {
        var _a;
        if (editorView.current || !editorEl.current || !editorState)
            return;
        var doUpdateState = function (next, tr) { return (dispatch(actions.updateEditorState(stateKey, viewId, next, tr))); };
        var updateState = opts.throttle > 0 ? throttle(doUpdateState, opts.throttle) : doUpdateState;
        editorView.current = createEditorView(editorEl.current, editorState, function (tr) {
            var _a;
            var view = editorView.current;
            var mtr = opts.modifyTransaction(stateKey, viewId, view.state, tr);
            var next = view.state.apply(mtr);
            updateState(next, mtr);
            (_a = editorView.current) === null || _a === void 0 ? void 0 : _a.updateState(next);
        });
        editorView.current.dom.id = viewId;
        if (className)
            (_a = editorView.current.dom.classList).add.apply(_a, className.split(' '));
        editorView.current.dom.onfocus = function () {
            dispatch(actions.focusEditorView(viewId, true));
        };
        editorView.current.dom.onblur = function () {
            dispatch(actions.focusEditorView(viewId, false));
        };
        dispatch(actions.subscribeView(stateKey, viewId, editorView.current));
    }, [editorView.current == null, editorEl.current == null, editorState == null]);
    useEffect(function () { return function () {
        if (autoUnsubscribe && editorView.current) {
            dispatch(actions.unsubscribeView(stateKey, viewId));
        }
    }; }, []);
    useEffect(function () {
        var _a, _b, _c, _d;
        if (editorEl.current == null)
            return;
        if (((_a = editorView.current) === null || _a === void 0 ? void 0 : _a.hasFocus()) === focused)
            return;
        if (!focused) {
            (_c = (_b = editorView.current) === null || _b === void 0 ? void 0 : _b.dom) === null || _c === void 0 ? void 0 : _c.blur();
            return;
        }
        var subEditors = editorEl.current.getElementsByClassName('ProseMirror-focused');
        if (subEditors.length > 0)
            return;
        (_d = editorView.current) === null || _d === void 0 ? void 0 : _d.focus();
    }, [focused]);
    return React.createElement("div", { ref: editorEl });
};
Editor.defaultProps = {
    autoUnsubscribe: true,
    className: '',
};
export default Editor;
//# sourceMappingURL=Editor.js.map