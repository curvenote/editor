import { nodeNames } from '@curvenote/schema';
import { findParentNode, findChildrenByType } from 'prosemirror-utils';
var popper = null;
export function registerPopper(next) {
    popper = next;
}
export function positionPopper() {
    popper === null || popper === void 0 ? void 0 : popper.update();
}
export function getFigure(editorState) {
    if (!editorState) {
        return { figure: undefined, figcaption: undefined };
    }
    var selection = editorState.selection;
    var figure = selection && findParentNode(function (n) { return n.type.name === nodeNames.figure; })(selection);
    var figcaption = figure
        ? findChildrenByType(figure === null || figure === void 0 ? void 0 : figure.node, editorState.schema.nodes[nodeNames.figcaption])[0]
        : undefined;
    return { figure: figure, figcaption: figcaption };
}
//# sourceMappingURL=utils.js.map