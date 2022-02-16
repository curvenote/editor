import React, { useCallback } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { findParentNode } from 'prosemirror-utils';
import { CaptionKind, nodeNames } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, deleteNode, updateNodeAttrs, createFigureCaption, createFigure, } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import { actions } from '../../store';
import { getFigure, positionPopper } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';
import { CommandNames } from '../../store/suggestion/commands';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            width: 'fit-content',
            fontSize: 20,
            flexWrap: 'nowrap',
        },
        popover: {
            overflow: 'visible',
        },
    });
});
function TableActions(props) {
    var _a, _b, _c, _d;
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var dispatch = useDispatch();
    var editorState = useSelector(function (state) { var _a; return (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var selection = editorState === null || editorState === void 0 ? void 0 : editorState.selection;
    var _e = getFigure(editorState), figure = _e.figure, figcaption = _e.figcaption;
    if (figcaption && figure)
        figcaption.pos = figure.pos + 1 + figcaption.pos;
    var parent = selection && findParentNode(function (n) { return n.type.name === nodeNames.table; })(selection);
    var node = (_a = parent === null || parent === void 0 ? void 0 : parent.node) !== null && _a !== void 0 ? _a : getNodeFromSelection(selection);
    var pos = (_b = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _b !== void 0 ? _b : selection === null || selection === void 0 ? void 0 : selection.from;
    var command = useCallback(function (name) { return dispatch(actions.executeCommand(name, viewId)); }, [stateId, viewId]);
    if (!editorState || !node || pos == null)
        return null;
    positionPopper();
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, figure !== null && figure !== void 0 ? figure : { node: node, pos: pos })); };
    var onCaption = function () {
        if (!figure) {
            var wrapped = createFigure(editorState.schema, node, true);
            var tr = editorState.tr
                .setSelection(NodeSelection.create(editorState.doc, pos))
                .replaceSelectionWith(wrapped);
            var selected = tr.setSelection(TextSelection.create(tr.doc, pos + 2));
            dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
            return;
        }
        if (figcaption) {
            var tr = editorState.tr
                .setSelection(NodeSelection.create(editorState.doc, figcaption.pos))
                .deleteSelection();
            dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
        }
        else {
            var caption = createFigureCaption(editorState.schema, CaptionKind.table);
            var tr = editorState.tr.insert(figure.pos + 1, caption);
            var selected = tr.setSelection(TextSelection.create(tr.doc, figure.pos + 2));
            dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
        }
    };
    var numbered = (_d = (_c = figure === null || figure === void 0 ? void 0 : figure.node.attrs) === null || _c === void 0 ? void 0 : _c.numbered) !== null && _d !== void 0 ? _d : false;
    var onNumbered = function () {
        if (!figure || !figcaption)
            return;
        dispatch(updateNodeAttrs(stateId, viewId, figure, { numbered: !numbered }));
        dispatch(updateNodeAttrs(stateId, viewId, figcaption, {}, 'inside'));
    };
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "rowAbove", onClick: function () { return command(CommandNames.add_row_before); } }),
        React.createElement(MenuIcon, { kind: "rowBelow", onClick: function () { return command(CommandNames.add_row_after); } }),
        React.createElement(MenuIcon, { kind: "colLeft", onClick: function () { return command(CommandNames.add_column_before); } }),
        React.createElement(MenuIcon, { kind: "colRight", onClick: function () { return command(CommandNames.add_column_after); } }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "rowDelete", onClick: function () { return command(CommandNames.delete_row); }, dangerous: true }),
        React.createElement(MenuIcon, { kind: "colDelete", onClick: function () { return command(CommandNames.delete_column); }, dangerous: true }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "caption", active: Boolean(figcaption), onClick: onCaption }),
        figcaption && React.createElement(MenuIcon, { kind: "numbered", active: numbered, onClick: onNumbered }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
}
export default TableActions;
//# sourceMappingURL=TableActions.js.map