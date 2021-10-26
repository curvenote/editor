import { nodeNames } from '@curvenote/schema';
import { NodeSelection } from 'prosemirror-state';
import { findParentNode, findParentNodeOfType } from 'prosemirror-utils';
import { insertParagraphAndSelect } from '../../store/actions/utils';
function selectInsideParent(tr, pos) {
    return tr.setSelection(NodeSelection.create(tr.doc, pos - 1)).scrollIntoView();
}
var handleEnter = function handleEnter(state, dispatch) {
    var $head = state.selection.$head;
    if ($head.parent.type.name === nodeNames.figure) {
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(insertParagraphAndSelect(state.schema, state.tr, $head.end() + $head.depth));
        return true;
    }
    if ($head.parent.type.name !== nodeNames.figcaption)
        return false;
    var figure = findParentNodeOfType(state.schema.nodes[nodeNames.figure])(state.selection);
    if (!figure)
        return false;
    if (!state.selection.empty) {
        var _a = state.selection, from = _a.from, to = _a.to;
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(state.tr.deleteRange(from, to));
        return true;
    }
    if (figure.pos + figure.node.nodeSize === $head.pos + $head.depth) {
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(insertParagraphAndSelect(state.schema, state.tr, $head.end() + $head.depth));
        return true;
    }
    if (figure.start === $head.pos - 1) {
        dispatch === null || dispatch === void 0 ? void 0 : dispatch(insertParagraphAndSelect(state.schema, state.tr, $head.start() - $head.depth));
        return true;
    }
    dispatch === null || dispatch === void 0 ? void 0 : dispatch(selectInsideParent(state.tr, $head.start()));
    return true;
};
var deleteBeforeFigure = function deleteBeforeFigure(state, dispatch) {
    var $head = state.selection.$head;
    if (!state.selection.empty || $head.parentOffset !== $head.parent.nodeSize - 2)
        return false;
    var parent = findParentNode(function () { return true; })(state.selection);
    if (!parent)
        return false;
    var possibleFigure = state.doc.resolve(parent.pos + parent.node.nodeSize + 1);
    if (possibleFigure.parent.type.name !== nodeNames.figure)
        return false;
    var tr = state.tr;
    var figPos = parent.pos + parent.node.nodeSize;
    if (parent.node.nodeSize === 2) {
        tr = state.tr.delete(parent.pos, parent.pos + parent.node.nodeSize);
        figPos -= parent.node.nodeSize;
    }
    dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr.setSelection(NodeSelection.create(tr.doc, figPos)).scrollIntoView());
    return true;
};
var backspaceAfterFigure = function backspaceAfterFigure(state, dispatch) {
    if (!state.selection.empty || state.selection.$head.parentOffset !== 0)
        return false;
    var parent = findParentNode(function () { return true; })(state.selection);
    if (!parent)
        return false;
    var possibleFigure = state.doc.resolve(parent.pos).nodeBefore;
    if ((possibleFigure === null || possibleFigure === void 0 ? void 0 : possibleFigure.type.name) !== nodeNames.figure)
        return false;
    var tr = state.tr;
    if (parent.node.nodeSize === 2) {
        tr = state.tr.delete(parent.pos, parent.pos + parent.node.nodeSize);
    }
    var figPos = parent.pos - possibleFigure.nodeSize;
    dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr.setSelection(NodeSelection.create(tr.doc, figPos)).scrollIntoView());
    return true;
};
var deleteCaptionAndSelect = function deleteCaptionAndSelect(state, dispatch) {
    var parent = findParentNode(function () { return true; })(state.selection);
    var figure = findParentNodeOfType(state.schema.nodes[nodeNames.figure])(state.selection);
    if (!parent || !figure)
        return false;
    var tr = state.tr;
    if (parent.node.nodeSize === 2) {
        tr = state.tr.delete(parent.pos, parent.pos + parent.node.nodeSize);
    }
    dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr.setSelection(NodeSelection.create(tr.doc, figure.pos)).scrollIntoView());
    return true;
};
var backspaceInFigure = function backspaceInFigure(state, dispatch) {
    var $head = state.selection.$head;
    if (!state.selection.empty ||
        $head.parent.type.name !== nodeNames.figcaption ||
        $head.parentOffset !== 0)
        return false;
    return deleteCaptionAndSelect(state, dispatch);
};
var deleteInFigure = function deleteInFigure(state, dispatch) {
    var $head = state.selection.$head;
    if (!state.selection.empty ||
        $head.parent.type.name !== nodeNames.figcaption ||
        $head.parentOffset !== $head.parent.nodeSize - 2)
        return false;
    return deleteCaptionAndSelect(state, dispatch);
};
export function buildFigureKeymap(schema, bind) {
    if (schema.nodes.figure) {
        bind('Enter', handleEnter);
        bind('Backspace', backspaceAfterFigure, backspaceInFigure);
        bind('Delete', deleteBeforeFigure, deleteInFigure);
    }
}
//# sourceMappingURL=figure.js.map