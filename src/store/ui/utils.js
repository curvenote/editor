import { findParentNode, isNodeSelection } from 'prosemirror-utils1';
import { nodeNames } from '@curvenote/schema';
import { getLinkBoundsIfTheyExist } from '../actions/utils';
import { SelectionKinds } from './types';
export function getNodeFromSelection(selection) {
    if (!selection || !isNodeSelection(selection))
        return null;
    var nodeSelection = selection;
    return nodeSelection.node;
}
export function getNodeIfSelected(state, nodeName) {
    if (state == null)
        return null;
    var node = getNodeFromSelection(state.selection);
    if (node && (!nodeName || node.type.name === nodeName)) {
        return node;
    }
    return null;
}
export var getSelectionKind = function (state) {
    var _a;
    if (state == null)
        return null;
    var linkBounds = getLinkBoundsIfTheyExist(state);
    if (linkBounds)
        return { kind: SelectionKinds.link, pos: linkBounds.from };
    var node = getNodeFromSelection(state.selection);
    var pos = state.selection.from;
    switch (node === null || node === void 0 ? void 0 : node.type.name) {
        case nodeNames.image:
            if (findParentNode(function (n) { return n.type.name === nodeNames.figure; })(state.selection))
                break;
            return { kind: SelectionKinds.image, pos: pos };
        case nodeNames.iframe:
            if (findParentNode(function (n) { return n.type.name === nodeNames.figure; })(state.selection))
                break;
            return { kind: SelectionKinds.iframe, pos: pos };
        case nodeNames.math:
            return { kind: SelectionKinds.math, pos: pos };
        case nodeNames.link_block:
            return { kind: SelectionKinds.link_block, pos: pos };
        case nodeNames.equation:
            return { kind: SelectionKinds.equation, pos: pos };
        case nodeNames.cite:
            return { kind: SelectionKinds.cite, pos: pos };
        case nodeNames.time:
            return { kind: SelectionKinds.time, pos: pos };
        case nodeNames.callout:
            return { kind: SelectionKinds.callout, pos: pos };
        case nodeNames.heading:
            return { kind: SelectionKinds.heading, pos: pos };
        case nodeNames.figure:
            return { kind: SelectionKinds.figure, pos: pos };
        default:
            break;
    }
    var parent = findParentNode(function (n) {
        switch (n === null || n === void 0 ? void 0 : n.type.name) {
            case nodeNames.heading: {
                var _a = state.selection, _b = _a.$from, from = _b.parentOffset, nodeSize = _b.parent.nodeSize, to = _a.$to.parentOffset;
                return from === 0 && to === nodeSize - 2;
            }
            case nodeNames.callout:
                return true;
            case nodeNames.table:
                return true;
            case nodeNames.code_block:
                return true;
            case nodeNames.figure:
                return true;
            default:
                return false;
        }
    })(state.selection);
    if (!parent)
        return null;
    switch ((_a = parent.node) === null || _a === void 0 ? void 0 : _a.type.name) {
        case nodeNames.heading:
            return { kind: SelectionKinds.heading, pos: parent.pos };
        case nodeNames.callout:
            return { kind: SelectionKinds.callout, pos: parent.pos };
        case nodeNames.table:
            return { kind: SelectionKinds.table, pos: parent.pos };
        case nodeNames.code_block: {
            var figure = findParentNode(function (n) { return n.type.name === nodeNames.figure; })(state.selection);
            if (figure)
                return { kind: SelectionKinds.code, pos: figure.pos };
            return { kind: SelectionKinds.code, pos: parent.pos };
        }
        case nodeNames.figure:
            return { kind: SelectionKinds.figure, pos: parent.pos };
        default:
            break;
    }
    return null;
};
//# sourceMappingURL=utils.js.map