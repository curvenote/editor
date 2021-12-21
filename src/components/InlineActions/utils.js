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
export function createPopperLocationCache() {
    var cache = {
        node: null,
        clientRect: null,
        clientWidth: 0,
        clientHeight: 0,
    };
    function setNode(nodeOrFunction) {
        var _a, _b;
        var node = typeof nodeOrFunction === 'function' ? nodeOrFunction() : nodeOrFunction;
        cache.node = nodeOrFunction;
        if (node && node.isConnected) {
            cache.clientRect = node.getBoundingClientRect();
            cache.clientWidth = (_a = node.clientWidth) !== null && _a !== void 0 ? _a : 0;
            cache.clientHeight = (_b = node.clientHeight) !== null && _b !== void 0 ? _b : 0;
        }
    }
    function getNode() {
        var node = typeof cache.node === 'function' ? cache.node() : cache.node;
        return node;
    }
    var anchorEl = {
        getBoundingClientRect: function () {
            setNode(cache.node);
            return cache.clientRect;
        },
        get clientWidth() {
            setNode(cache.node);
            return cache.clientWidth;
        },
        get clientHeight() {
            setNode(cache.node);
            return cache.clientHeight;
        },
    };
    return {
        setNode: setNode,
        getNode: getNode,
        anchorEl: anchorEl,
    };
}
//# sourceMappingURL=utils.js.map