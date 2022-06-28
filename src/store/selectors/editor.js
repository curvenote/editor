import { NodeSelection } from 'prosemirror-state';
import { findParentNode, isNodeSelection, hasParentNode, } from 'prosemirror-utils1';
import { getNodeIfSelected } from '../ui/utils';
import { isEditable } from '../../prosemirror/plugins/editable';
import { getEditorState } from '../state/selectors';
import { getEditorUI } from '../ui/selectors';
export function getParentsOfSelection(state, stateKey) {
    if (stateKey == null)
        return [];
    var editor = getEditorState(state, stateKey);
    if (editor.state == null)
        return [];
    var predicate = function () { return true; };
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
}
export function getNodeAttrs(state, stateId, pos) {
    var _a;
    if (stateId == null)
        return null;
    var editor = getEditorState(state, stateId);
    if (editor.state == null)
        return null;
    var out = editor.state.doc.resolve(pos);
    var node = (_a = out.nodeAfter) !== null && _a !== void 0 ? _a : out.parent;
    return node.attrs;
}
export function menuActive(state, stateId) {
    var editor = getEditorState(state, stateId);
    if (editor.state == null)
        return false;
    return isEditable(editor.state);
}
function falseMap(obj) {
    return Object.fromEntries(Object.entries(obj).map(function (_a) {
        var key = _a[0];
        return [key, false];
    }));
}
export function selectionIsMarkedWith(state, stateKey, types) {
    var editor = getEditorState(state, stateKey);
    if (editor.state == null)
        return falseMap(types);
    var _a = editor.state.selection, from = _a.from, $from = _a.$from, to = _a.to, empty = _a.empty;
    var active = Object.fromEntries(Object.entries(types).map(function (_a) {
        var key = _a[0], type = _a[1];
        var mark = type;
        if (!mark)
            return [key, false];
        if (empty)
            return [key, Boolean(mark.isInSet(editor.state.storedMarks || $from.marks()))];
        return [key, editor.state.doc.rangeHasMark(from, to, mark)];
    }));
    return active;
}
export function selectionIsChildOf(state, stateKey, nodes) {
    var editor = getEditorState(state, stateKey);
    if (editor.state == null)
        return falseMap(nodes);
    var active = Object.fromEntries(Object.entries(nodes).map(function (_a) {
        var key = _a[0], type = _a[1];
        var node = type;
        if (!node)
            return [key, false];
        return [key, hasParentNode(function (test) { return test.type === node; })(editor.state.selection)];
    }));
    return active;
}
export function selectionIsChildOfActiveState(state, nodes) {
    var stateId = getEditorUI(state).stateId;
    return selectionIsChildOf(state, stateId, nodes);
}
export function selectionIsThisNodeType(state, stateKey, nodes) {
    var editor = getEditorState(state, stateKey);
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
}
//# sourceMappingURL=editor.js.map