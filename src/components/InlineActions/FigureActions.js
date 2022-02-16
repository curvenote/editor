import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { findChildrenByType, findParentNode } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import { nodeNames, CaptionKind } from '@curvenote/schema';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, deleteNode, updateNodeAttrs, selectFirstNodeOfTypeInParent, findChildrenWithName, createFigureCaption, } from '../../store/actions';
import SelectWidth from './SelectWidth';
import { positionPopper } from './utils';
import { getEditorState } from '../../store/selectors';
import { getNodeFromSelection } from '../../store/ui/utils';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            width: 'fit-content',
            fontSize: 20,
            flexWrap: 'nowrap',
        },
    });
});
function toggleCaption(stateId, viewId, figurePos) {
    return function (dispatch, getState) {
        var _a;
        var editorState = (_a = getEditorState(getState(), stateId)) === null || _a === void 0 ? void 0 : _a.state;
        if (!editorState)
            return;
        var pos = editorState.doc.resolve(figurePos);
        var figure = pos.nodeAfter;
        if (!figure || figure.type.name !== nodeNames.figure)
            return;
        var FigcaptionNode = editorState.schema.nodes[nodeNames.figcaption];
        var figcaption = findChildrenByType(figure, FigcaptionNode)[0];
        var child = findChildrenWithName(figure, [nodeNames.image, nodeNames.iframe])[0];
        var start = figurePos + 1;
        if (figcaption) {
            if (figure.childCount === 1) {
                var nodeSelection_1 = NodeSelection.create(editorState.doc, figurePos);
                var tr_1 = editorState.tr.setSelection(nodeSelection_1).deleteSelection();
                dispatch(applyProsemirrorTransaction(stateId, viewId, tr_1, true));
                return;
            }
            var nodeSelection = NodeSelection.create(editorState.doc, start + figcaption.pos);
            var tr = editorState.tr.setSelection(nodeSelection).deleteSelection();
            var selected = selectFirstNodeOfTypeInParent([nodeNames.image, nodeNames.iframe], tr, figurePos);
            dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
        }
        else {
            var newcaption = createFigureCaption(editorState.schema, CaptionKind.fig, child.node.attrs.src);
            var insertion = start + child.pos + child.node.nodeSize;
            var tr = editorState.tr.insert(insertion, newcaption);
            var captionstart = insertion + 1;
            var captionend = captionstart + newcaption.nodeSize - 2;
            var selected = tr
                .setSelection(TextSelection.create(tr.doc, captionstart, captionend))
                .scrollIntoView();
            dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
        }
    };
}
function FigureImageActions(props) {
    var _a, _b, _c, _d, _e, _f;
    var stateId = props.stateId, viewId = props.viewId;
    var dispatch = useDispatch();
    var classes = useStyles();
    var editorState = useSelector(function (state) { var _a; return (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var selection = editorState === null || editorState === void 0 ? void 0 : editorState.selection;
    var parent = selection && findParentNode(function (n) { return n.type.name === nodeNames.figure; })(selection);
    var figure = (_a = parent === null || parent === void 0 ? void 0 : parent.node) !== null && _a !== void 0 ? _a : getNodeFromSelection(selection);
    var pos = (_b = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _b !== void 0 ? _b : selection === null || selection === void 0 ? void 0 : selection.from;
    if (!editorState || !figure || pos == null)
        return null;
    var align = (figure === null || figure === void 0 ? void 0 : figure.attrs).align;
    var child = findChildrenWithName(figure, [
        nodeNames.image,
        nodeNames.iframe,
        nodeNames.table,
        nodeNames.code_block,
    ])[0];
    var hasWidth = child &&
        !(child.node.type.name === nodeNames.table || child.node.type.name === nodeNames.code_block);
    var hasAlign = child && child.node.type.name !== nodeNames.code_block;
    var FigcaptionNode = editorState.schema.nodes[nodeNames.figcaption];
    var figcaption = findChildrenByType(figure, FigcaptionNode)[0];
    var onAlign = function (a) { return function () {
        dispatch(updateNodeAttrs(stateId, viewId, { node: figure, pos: pos }, { align: a }));
    }; };
    if (child)
        child.pos = pos + 1 + child.pos;
    if (figcaption)
        figcaption.pos = pos + 1 + figcaption.pos;
    var width = (_d = (_c = child === null || child === void 0 ? void 0 : child.node.attrs) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : null;
    var numbered = (_f = (_e = figure === null || figure === void 0 ? void 0 : figure.attrs) === null || _e === void 0 ? void 0 : _e.numbered) !== null && _f !== void 0 ? _f : false;
    var onWidth = function (value) {
        if (!child)
            return;
        dispatch(updateNodeAttrs(stateId, viewId, child, { width: value }));
        positionPopper();
    };
    var onNumbered = function () {
        dispatch(updateNodeAttrs(stateId, viewId, { node: figure, pos: pos }, { numbered: !numbered }));
        dispatch(updateNodeAttrs(stateId, viewId, figcaption, {}, 'inside'));
    };
    var onCaption = function () {
        dispatch(toggleCaption(stateId, viewId, pos));
        positionPopper();
    };
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, { node: figure, pos: pos })); };
    positionPopper();
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.root },
        hasAlign && (React.createElement(React.Fragment, null,
            React.createElement(MenuIcon, { kind: "left", active: align === 'left', onClick: onAlign('left') }),
            React.createElement(MenuIcon, { kind: "center", active: align === 'center', onClick: onAlign('center') }),
            React.createElement(MenuIcon, { kind: "right", active: align === 'right', onClick: onAlign('right') }),
            React.createElement(MenuIcon, { kind: "divider" }))),
        hasWidth && (React.createElement(React.Fragment, null,
            React.createElement(SelectWidth, { width: width, onWidth: onWidth }),
            React.createElement(MenuIcon, { kind: "divider" }))),
        React.createElement(MenuIcon, { kind: "caption", active: Boolean(figcaption), onClick: onCaption }),
        figcaption && React.createElement(MenuIcon, { kind: "numbered", active: numbered, onClick: onNumbered }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
}
export default FigureImageActions;
//# sourceMappingURL=FigureActions.js.map