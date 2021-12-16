import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { opts } from '../connect';
import { createEditorView } from '../prosemirror';
import { actions, selectors } from '../store';
var Editor = function (props) {
    var stateKey = props.stateKey, viewId = props.viewId, className = props.className, autoUnsubscribe = props.autoUnsubscribe;
    var dispatch = useDispatch();
    var editorEl = useRef(null);
    var editorView = useRef();
    var editorState = useSelector(function (state) { var _a; return (_a = selectors.getEditorState(state, stateKey)) === null || _a === void 0 ? void 0 : _a.state; });
    useEffect(function () {
        var _a;
        if (editorView.current || !editorEl.current || !editorState)
            return;
        var updateState = function (next, tr) {
            return dispatch(actions.updateEditorState(stateKey, viewId, next, tr));
        };
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
            dispatch(actions.selectEditorView(viewId));
        };
        dispatch(actions.subscribeView(stateKey, viewId, editorView.current));
    }, [editorView.current == null, editorEl.current == null, editorState == null]);
    useEffect(function () { return function () {
        if (autoUnsubscribe && editorView.current) {
            dispatch(actions.unsubscribeView(stateKey, viewId));
        }
    }; }, []);
    return React.createElement("div", { ref: editorEl });
};
Editor.defaultProps = {
    autoUnsubscribe: true,
    className: '',
};
export default Editor;
//# sourceMappingURL=Editor.js.map