import { NodeSelection } from 'prosemirror-state';
import { findParentNode, isNodeSelection, hasParentNode, } from 'prosemirror-utils1';
import { createSelector } from '@reduxjs/toolkit';
import { getNodeIfSelected } from '../ui/utils';
import { isEditable } from '../../prosemirror/plugins/editable';
import { selectEditorState } from '../state/selectors';
import { getEditorUI } from '../ui/selectors';
var predicate = function () { return true; };
export var getParentsOfSelection = createSelector([selectEditorState, function (_, stateKey) { return stateKey; }], function (editor, stateKey) {
    if (!editor || !stateKey)
        return [];
    if (editor.state == null)
        return [];
    var getParent = findParentNode(predicate);
    var parents = [];
    if (isNodeSelection(editor.state.selection)) {
        var _a = editor.state.selection.$from, depth = _a.depth, pos = _a.pos, nodeAfter = _a.nodeAfter;
        parents.push({
            pos: pos,
            start: pos,
            depth: depth,
            node: nodeAfter !== null && nodeAfter !== void 0 ? nodeAfter : editor.state.doc.resolve(pos + 1).node(),
        });
    }
    var parent = getParent(editor.state.selection);
    while (parent !== undefined) {
        parents.push(parent);
        parent = getParent(NodeSelection.create(editor.state.doc, parent.pos));
    }
    return parents.reverse();
});
export var getNodeAttrs = createSelector([selectEditorState, function (_, stateKey, pos) { return pos; }], function (editor, pos) {
    var _a;
    if (editor.state == null)
        return null;
    var out = editor.state.doc.resolve(pos);
    var node = (_a = out.nodeAfter) !== null && _a !== void 0 ? _a : out.parent;
    return node.attrs;
});
export var menuActive = createSelector([selectEditorState], function (editor) {
    if (editor.state == null)
        return false;
    return isEditable(editor.state);
});
function falseMap(obj) {
    return Object.fromEntries(Object.entries(obj).map(function (_a) {
        var key = _a[0];
        return [key, false];
    }));
}
function makeSelectionIsMarkedWith() {
    return createSelector([
        selectEditorState,
        function (_, stateKey, types) { return types; },
    ], function (editor, types) {
        var editorState = editor.state;
        if (editorState == null)
            return falseMap(types);
        var _a = editorState.selection, from = _a.from, $from = _a.$from, to = _a.to, empty = _a.empty;
        var active = Object.fromEntries(Object.entries(types).map(function (_a) {
            var key = _a[0], type = _a[1];
            var mark = type;
            if (!mark)
                return [key, false];
            if (empty)
                return [key, Boolean(mark.isInSet(editorState.storedMarks || $from.marks()))];
            return [key, editorState.doc.rangeHasMark(from, to, mark)];
        }));
        return active;
    });
}
export var selectionIsMarkedWith = makeSelectionIsMarkedWith();
function makeSelectSelectionIsChildOf() {
    return createSelector([
        selectEditorState,
        function (_, stateKey, nodes) { return nodes; },
    ], function (editor, nodes) {
        var editorState = editor.state;
        if (editorState == null)
            return falseMap(nodes);
        var active = Object.fromEntries(Object.entries(nodes).map(function (_a) {
            var key = _a[0], type = _a[1];
            var node = type;
            if (!node)
                return [key, false];
            return [key, hasParentNode(function (test) { return test.type === node; })(editorState.selection)];
        }));
        return active;
    });
}
export var selectionIsChildOf = makeSelectSelectionIsChildOf();
export function selectionIsChildOfActiveState(state, nodes) {
    var stateId = getEditorUI(state).stateId;
    return selectionIsChildOf(state, stateId, nodes);
}
function makeSelectSelectionIsThisNodeType() {
    return createSelector([
        selectEditorState,
        function (_, stateKey, nodes) { return nodes; },
    ], function (editor, nodes) {
        if (editor.state == null)
            return falseMap(nodes);
        var active = Object.fromEntries(Object.entries(nodes).map(function (_a) {
            var key = _a[0], type = _a[1];
            var node = type;
            if (!node)
                return [key, false];
            return [key, Boolean(getNodeIfSelected(editor.state, node.name))];
        }));
        return active;
    });
}
export var selectionIsThisNodeType = makeSelectSelectionIsThisNodeType();
//# sourceMappingURL=editor.js.map