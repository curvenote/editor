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
import { NodeSelection, Selection, } from 'prosemirror-state';
import { wrapIn as wrapInPM, setBlockType as setBlockTypePM, toggleMark as toggleMarkPM, selectParentNode, } from 'prosemirror-commands';
import { wrapInList as wrapInListPM, liftListItem } from 'prosemirror-schema-list';
import { Fragment, } from 'prosemirror-model';
import { replaceSelectedNode, selectParentNodeOfType } from 'prosemirror-utils';
import { dispatchCommentAction } from '../../prosemirror/plugins/comments';
import { getEditorState, getSelectedEditorAndViews, getEditorUI, selectionIsChildOf, getSelectedView, getEditorView, } from '../selectors';
import schema from '../../prosemirror/schema';
import { focusEditorView, focusSelectedEditorView } from '../ui/actions';
import { applyProsemirrorTransaction } from '../state/actions';
import { getNodeIfSelected } from '../../prosemirror/utils';
export function updateNodeAttrs(stateKey, viewId, node, attrs) {
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateKey)) === null || _a === void 0 ? void 0 : _a.state;
        if (editorState == null)
            return false;
        var tr = editorState.tr.setNodeMarkup(node.pos, undefined, __assign(__assign({}, node.node.attrs), attrs));
        tr.setSelection(NodeSelection.create(tr.doc, node.pos));
        var result = dispatch(applyProsemirrorTransaction(stateKey, tr));
        if (result && viewId)
            dispatch(focusEditorView(viewId, true));
        return result;
    };
}
export function toggleMark(stateKey, viewId, mark, attrs) {
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateKey)) === null || _a === void 0 ? void 0 : _a.state;
        if (editorState == null)
            return false;
        var action = toggleMarkPM(mark, attrs);
        var result = action(editorState, function (tr) { return dispatch(applyProsemirrorTransaction(stateKey, tr)); });
        if (result)
            dispatch(focusEditorView(viewId, true));
        return result;
    };
}
export function wrapInList(stateKey, viewId, node, test) {
    if (test === void 0) { test = false; }
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateKey)) === null || _a === void 0 ? void 0 : _a.state;
        if (editorState == null)
            return false;
        var action = selectionIsChildOf(getState(), stateKey, { node: node }).node
            ? liftListItem(schema.nodes.list_item)
            : wrapInListPM(node);
        if (test)
            return action(editorState);
        var result = action(editorState, function (tr) { return dispatch(applyProsemirrorTransaction(stateKey, tr)); });
        if (result)
            dispatch(focusEditorView(viewId, true));
        return result;
    };
}
export function wrapIn(node) {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null)
            return false;
        var isList = (node === schema.nodes.ordered_list
            || node === schema.nodes.bullet_list);
        if (isList) {
            var viewId = getEditorUI(getState()).viewId;
            return dispatch(wrapInList(editor.stateId, viewId, node));
        }
        var action = wrapInPM(node);
        var result = action(editor.state, function (tr) { return dispatch(applyProsemirrorTransaction(editor.stateId, tr)); });
        if (result)
            dispatch(focusSelectedEditorView(true));
        return result;
    };
}
function getContent(state, content) {
    var nodeContent = content;
    if (!nodeContent && !state.selection.empty) {
        var _a = state.selection, from = _a.from, to = _a.to;
        var text = state.doc.textBetween(from, to);
        nodeContent = schema.text(text);
    }
    return nodeContent;
}
var selectNode = function (tr) {
    var _a, _b;
    var nodeSize = (_b = (_a = tr.selection.$anchor.nodeBefore) === null || _a === void 0 ? void 0 : _a.nodeSize) !== null && _b !== void 0 ? _b : 0;
    var resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);
    try {
        return tr.setSelection(new NodeSelection(resolvedPos));
    }
    catch (error) {
        return tr;
    }
};
export function replaceSelection(node, attrs, content) {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null)
            return false;
        var nodeContent = getContent(editor.state, content);
        var selectParagraph = selectParentNodeOfType(schema.nodes.paragraph);
        var replaceWithNode = replaceSelectedNode(node.create(attrs, nodeContent));
        var tr = replaceWithNode(selectParagraph(editor.state.tr));
        if (node.name === schema.nodes.code_block.name) {
            var pos = tr.doc.resolve(tr.selection.from + 1);
            var sel = new Selection(pos, pos);
            tr = tr.setSelection(sel);
        }
        return dispatch(applyProsemirrorTransaction(editor.stateId, tr));
    };
}
function setBlockType(node, attrs) {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null)
            return false;
        var action = setBlockTypePM(node, attrs);
        var result = action(editor.state, function (tr) { return dispatch(applyProsemirrorTransaction(editor.stateId, tr)); });
        if (result)
            dispatch(focusSelectedEditorView(true));
        return result;
    };
}
export function insertNode(node, attrs, content) {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null)
            return false;
        var tr = editor.state.tr.insert(editor.state.tr.selection.$from.pos, node.create(attrs, content)).scrollIntoView();
        dispatch(applyProsemirrorTransaction(editor.stateId, tr));
        return true;
    };
}
export function insertInlineNode(node, attrs, content) {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null)
            return false;
        var nodeContent = getContent(editor.state, content);
        var tr = editor.state.tr.replaceSelectionWith(node.create(attrs, nodeContent), false).scrollIntoView();
        dispatch(applyProsemirrorTransaction(editor.stateId, selectNode(tr)));
        return true;
    };
}
export var wrapInHeading = function (level) {
    if (level === 0)
        return setBlockType(schema.nodes.paragraph);
    return setBlockType(schema.nodes.heading, { level: level });
};
export var insertVariable = function (attrs) {
    if (attrs === void 0) { attrs = { name: 'myVar', value: '0', valueFunction: '' }; }
    return (replaceSelection(schema.nodes.variable, attrs));
};
export function addComment(viewId, commentId) {
    return function (dispatch, getState) {
        var view = getEditorView(getState(), viewId).view;
        if (!view)
            return false;
        dispatchCommentAction(view, { type: 'add', commentId: commentId });
        return true;
    };
}
export function removeComment(viewId, commentId) {
    return function (dispatch, getState) {
        var view = getEditorView(getState(), viewId).view;
        if (!view)
            return false;
        dispatchCommentAction(view, { type: 'remove', commentId: commentId });
        return true;
    };
}
export function addCommentToSelectedView(commentId) {
    return function (dispatch, getState) {
        var viewId = getSelectedView(getState()).viewId;
        if (!viewId)
            return false;
        dispatch(addComment(viewId, commentId));
        return true;
    };
}
export function toggleCitationBrackets() {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null)
            return false;
        var node = getNodeIfSelected(editor.state, schema.nodes.cite);
        if (!node)
            return false;
        var parent = editor.state.selection.$from.parent;
        var hasParenthesis = parent.type.name === schema.nodes.cite_group.name;
        if (hasParenthesis) {
            var nodes_1 = [];
            parent.forEach(function (n) { return nodes_1.push(n); });
            var frag_1 = Fragment.from(nodes_1);
            selectParentNode(editor.state, function (tr) {
                var tr2 = tr
                    .deleteSelection()
                    .insert(tr.selection.head, frag_1)
                    .scrollIntoView();
                dispatch(applyProsemirrorTransaction(editor.stateId, tr2));
            });
            return true;
        }
        var wrapped = schema.nodes.cite_group.createAndFill({}, Fragment.from([node]));
        if (!wrapped)
            return false;
        var tr = editor.state.tr.replaceSelectionWith(wrapped).scrollIntoView();
        dispatch(applyProsemirrorTransaction(editor.stateId, tr));
        return true;
    };
}
//# sourceMappingURL=editor.js.map