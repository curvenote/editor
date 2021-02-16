import React, { useEffect, useRef, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';
import { opts } from '../connect';
import { createEditorView } from '../prosemirror';
import { actions, selectors, } from '../store';
var prompts = [
    'Type \'/\' for commands, or just start writing!',
    'Type \':\' for emotion',
    'Type \'$$\' to create an equation',
    'Type \'> \' to create a quote',
    'Type \'* \' for a list',
    'Type \'1. \' for a numbered list',
    'Type \'{{ 1 + 1 }}\' to display 2',
    'Type \'# \' for a header',
    'Type \'### \' for a smaller header',
    'Type \'`code`\' to insert code',
    'Type \'```\' to create a code block',
    'Type \'---\' to create a divider',
];
var promptStyle = {
    margin: 0, position: 'absolute', opacity: 0.4, left: 40, userSelect: 'none',
};
var Editor = function (props) {
    var stateKey = props.stateKey, viewId = props.viewId;
    var dispatch = useDispatch();
    var editorEl = useRef(null);
    var editorView = useRef();
    var hasContent = true;
    var editorState = useSelector(function (state) { var _a; return (_a = selectors.getEditorState(state, stateKey)) === null || _a === void 0 ? void 0 : _a.state; });
    var focused = useSelector(function (state) { return (selectors.isEditorViewFocused(state, stateKey, viewId)); });
    var _a = useState(prompts[0]), prompt = _a[0], setPrompt = _a[1];
    useEffect(function () { return setPrompt(prompts[Math.floor(Math.random() * prompts.length)]); }, [hasContent]);
    useEffect(function () {
        if (editorView.current || !editorEl.current || !editorState)
            return;
        var doUpdateState = function (next) { return (dispatch(actions.updateEditorState(stateKey, viewId, next))); };
        var updateState = opts.throttle > 0 ? throttle(doUpdateState, opts.throttle) : doUpdateState;
        editorView.current = createEditorView(editorEl.current, editorState, function (tr) {
            var _a;
            var view = editorView.current;
            var mtr = opts.modifyTransaction(stateKey, viewId, view.state, tr);
            var next = view.state.apply(mtr);
            updateState(next);
            (_a = editorView.current) === null || _a === void 0 ? void 0 : _a.updateState(next);
        });
        editorView.current.dom.id = viewId;
        editorView.current.dom.onfocus = function () {
            dispatch(actions.focusEditorView(viewId, true));
        };
        editorView.current.dom.onblur = function () {
            dispatch(actions.focusEditorView(viewId, false));
        };
        dispatch(actions.subscribeView(stateKey, viewId, editorView.current));
        setPrompt(prompts[0]);
    }, [editorView.current == null, editorEl.current == null, editorState == null]);
    useEffect(function () { return function () {
        if (editorView.current) {
            dispatch(actions.unsubscribeView(stateKey, viewId));
        }
    }; }, []);
    useEffect(function () {
        var _a, _b, _c;
        if (editorEl.current == null)
            return;
        if (!focused) {
            (_b = (_a = editorView.current) === null || _a === void 0 ? void 0 : _a.dom) === null || _b === void 0 ? void 0 : _b.blur();
            return;
        }
        var subEditors = editorEl.current.getElementsByClassName('ProseMirror-focused');
        if (subEditors.length > 0)
            return;
        (_c = editorView.current) === null || _c === void 0 ? void 0 : _c.focus();
    }, [focused]);
    return (React.createElement("div", null,
        !hasContent && (React.createElement("p", { style: promptStyle }, prompt)),
        React.createElement("div", { ref: editorEl })));
};
export default Editor;
//# sourceMappingURL=Editor.js.map