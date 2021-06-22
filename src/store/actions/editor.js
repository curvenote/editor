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
import { NodeSelection, Selection, TextSelection, } from 'prosemirror-state';
import { wrapIn as wrapInPM, setBlockType as setBlockTypePM, toggleMark as toggleMarkPM, selectParentNode, } from 'prosemirror-commands';
import { wrapInList as wrapInListPM, liftListItem } from 'prosemirror-schema-list';
import { Fragment, NodeRange } from 'prosemirror-model';
import { schemas } from '@curvenote/schema';
import { replaceSelectedNode, selectParentNodeOfType } from 'prosemirror-utils';
import { liftTarget } from 'prosemirror-transform';
import { dispatchCommentAction } from '../../prosemirror/plugins/comments';
import { getEditorState, getSelectedEditorAndViews, getEditorUI, selectionIsChildOf, getSelectedView, getEditorView, } from '../selectors';
import { focusEditorView, focusSelectedEditorView } from '../ui/actions';
import { applyProsemirrorTransaction } from '../state/actions';
import { getNodeIfSelected } from './utils';
import { createId } from '../../utils';
export function updateNodeAttrs(stateKey, viewId, node, attrs, select) {
    if (select === void 0) { select = true; }
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateKey)) === null || _a === void 0 ? void 0 : _a.state;
        if (editorState == null)
            return false;
        var tr = editorState.tr.setNodeMarkup(node.pos, undefined, __assign(__assign({}, node.node.attrs), attrs));
        if (select === true)
            tr.setSelection(NodeSelection.create(tr.doc, node.pos));
        if (select === 'after') {
            var sel = TextSelection.create(tr.doc, node.pos + node.node.nodeSize);
            tr.setSelection(sel);
        }
        var result = dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
        if (result && viewId)
            dispatch(focusEditorView(viewId, true));
        return result;
    };
}
export function deleteNode(stateKey, viewId, node) {
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateKey)) === null || _a === void 0 ? void 0 : _a.state;
        if (editorState == null)
            return false;
        var tr = editorState.tr.delete(node.pos, node.pos + node.node.nodeSize);
        var result = dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
        if (result && viewId)
            dispatch(focusEditorView(viewId, true));
        return result;
    };
}
export function liftContentOutOfNode(stateKey, viewId, node) {
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateKey)) === null || _a === void 0 ? void 0 : _a.state;
        if (editorState == null)
            return false;
        var $from = editorState.doc.resolve(node.pos + 1);
        var $to = editorState.doc.resolve(node.pos + node.node.nodeSize - 1);
        var range = new NodeRange($from, $to, 1);
        var target = liftTarget(range);
        if (target == null)
            return false;
        var tr = editorState.tr.lift(range, target);
        var result = dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
        if (result && viewId)
            dispatch(focusEditorView(viewId, true));
        return result;
    };
}
export function toggleMark(stateKey, viewId, mark, attrs) {
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateKey)) === null || _a === void 0 ? void 0 : _a.state;
        if (editorState == null || !mark)
            return false;
        var action = toggleMarkPM(mark, attrs);
        var result = action(editorState, function (tr) {
            return dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
        });
        if (result)
            dispatch(focusEditorView(viewId, true));
        return result;
    };
}
export function removeMark(stateKey, viewId, mark, from, to) {
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateKey)) === null || _a === void 0 ? void 0 : _a.state;
        if (editorState == null || !mark)
            return false;
        var tr = editorState.tr.removeMark(from, to, mark);
        var result = dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
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
            ? liftListItem(editorState.schema.nodes.list_item)
            : wrapInListPM(node);
        if (test)
            return action(editorState);
        var result = action(editorState, function (tr) {
            return dispatch(applyProsemirrorTransaction(stateKey, viewId, tr));
        });
        if (result)
            dispatch(focusEditorView(viewId, true));
        return result;
    };
}
export function wrapIn(node) {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null || !editor.key)
            return false;
        var isList = node === editor.state.schema.nodes.ordered_list ||
            node === editor.state.schema.nodes.bullet_list;
        if (isList) {
            var viewId = getEditorUI(getState()).viewId;
            return dispatch(wrapInList(editor.key, viewId, node));
        }
        var action = wrapInPM(node);
        var result = action(editor.state, function (tr) {
            return dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr));
        });
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
        nodeContent = state.schema.text(text);
    }
    return nodeContent;
}
var selectNode = function (tr, select) {
    var _a, _b;
    if (select === void 0) { select = true; }
    if (!select)
        return tr;
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
        var nodes = editor.state.schema.nodes;
        var selectParagraph = selectParentNodeOfType(nodes.paragraph);
        var replaceWithNode = replaceSelectedNode(node.create(attrs, nodeContent));
        var tr = replaceWithNode(selectParagraph(editor.state.tr));
        if (node.name === nodes.code_block.name) {
            var pos = tr.doc.resolve(tr.selection.from + 1);
            var sel = new Selection(pos, pos);
            tr = tr.setSelection(sel);
        }
        return dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr));
    };
}
function setBlockType(node, attrs) {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null)
            return false;
        var action = setBlockTypePM(node, attrs);
        var result = action(editor.state, function (tr) {
            return dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr));
        });
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
        var tr = editor.state.tr
            .insert(editor.state.tr.selection.$from.pos, node.create(attrs, content))
            .scrollIntoView();
        dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, selectNode(tr)));
        return true;
    };
}
export function insertInlineNode(node, attrs, content, select) {
    if (select === void 0) { select = true; }
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null || !node)
            return false;
        var nodeContent = getContent(editor.state, content);
        var tr = editor.state.tr
            .replaceSelectionWith(node.create(attrs, nodeContent), false)
            .scrollIntoView();
        dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, selectNode(tr, select)));
        return true;
    };
}
export function insertText(text) {
    return function (dispatch, getState) {
        var editor = getSelectedEditorAndViews(getState());
        if (editor.state == null)
            return false;
        var tr = editor.state.tr.insertText(text);
        dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr));
        return true;
    };
}
export var wrapInHeading = function (schema, level) {
    if (level === 0)
        return setBlockType(schema.nodes.paragraph);
    return setBlockType(schema.nodes.heading, { level: level, id: createId() });
};
export var insertVariable = function (schema, attrs) {
    if (attrs === void 0) { attrs = { name: 'myVar', value: '0', valueFunction: '' }; }
    return replaceSelection(schema.nodes.variable, attrs);
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
        var schema = editor.state.schema;
        var node = getNodeIfSelected(editor.state, schemas.nodeNames.cite);
        if (!node)
            return false;
        var parent = editor.state.selection.$from.parent;
        var hasParenthesis = parent.type.name === schema.nodes.cite_group.name;
        if (hasParenthesis) {
            var nodes_1 = [];
            parent.forEach(function (n) { return nodes_1.push(n); });
            var frag_1 = Fragment.from(nodes_1);
            selectParentNode(editor.state, function (tr) {
                var tr2 = tr.deleteSelection().insert(tr.selection.head, frag_1).scrollIntoView();
                dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr2));
            });
            return true;
        }
        var wrapped = schema.nodes.cite_group.createAndFill({}, Fragment.from([node]));
        if (!wrapped)
            return false;
        var tr = editor.state.tr.replaceSelectionWith(wrapped).scrollIntoView();
        dispatch(applyProsemirrorTransaction(editor.key, editor.viewId, tr));
        return true;
    };
}
//# sourceMappingURL=editor.js.map