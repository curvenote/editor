import { findParentNode, isNodeSelection } from 'prosemirror-utils';
import { schemas } from '@curvenote/schema';
import { getLinkBoundsIfTheyExist } from '../actions/utils';
import { SelectionKinds } from './types';
export var getSelectionKind = function (state) {
    var _a;
    if (state == null)
        return null;
    var linkBounds = getLinkBoundsIfTheyExist(state);
    if (linkBounds)
        return { kind: SelectionKinds.link, pos: linkBounds.from };
    var node = (isNodeSelection(state.selection)
        ? state.selection
        : { node: null }).node;
    var pos = state.selection.from;
    switch (node === null || node === void 0 ? void 0 : node.type.name) {
        case schemas.nodeNames.image:
            return { kind: SelectionKinds.image, pos: pos };
        case schemas.nodeNames.iframe:
            return { kind: SelectionKinds.iframe, pos: pos };
        case schemas.nodeNames.math:
            return { kind: SelectionKinds.math, pos: pos };
        case schemas.nodeNames.equation:
            return { kind: SelectionKinds.equation, pos: pos };
        case schemas.nodeNames.cite:
            return { kind: SelectionKinds.cite, pos: pos };
        case schemas.nodeNames.time:
            return { kind: SelectionKinds.time, pos: pos };
        case schemas.nodeNames.callout:
            return { kind: SelectionKinds.callout, pos: pos };
        case schemas.nodeNames.heading:
            return { kind: SelectionKinds.heading, pos: pos };
        default:
            break;
    }
    var parent = findParentNode(function (n) {
        switch (n === null || n === void 0 ? void 0 : n.type.name) {
            case schemas.nodeNames.heading: {
                var _a = state.selection, _b = _a.$from, from = _b.parentOffset, nodeSize = _b.parent.nodeSize, to = _a.$to.parentOffset;
                return from === 0 && to === nodeSize - 2;
            }
            case schemas.nodeNames.callout:
                return true;
            default:
                return false;
        }
    })(state.selection);
    if (!parent)
        return null;
    switch ((_a = parent.node) === null || _a === void 0 ? void 0 : _a.type.name) {
        case schemas.nodeNames.heading:
            return { kind: SelectionKinds.heading, pos: parent.pos };
        case schemas.nodeNames.callout:
            return { kind: SelectionKinds.callout, pos: parent.pos };
        default:
            break;
    }
    return null;
};
//# sourceMappingURL=utils.js.map