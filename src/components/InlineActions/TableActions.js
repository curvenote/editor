import React, { useCallback } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { findParentNode } from 'prosemirror-utils';
import { nodeNames } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { deleteNode } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import { actions } from '../../store';
import { positionPopper } from './utils';
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
var TableActions = function (props) {
    var _a, _b;
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var dispatch = useDispatch();
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    var parent = selection && findParentNode(function (n) { return n.type.name === nodeNames.table; })(selection);
    var node = (_a = parent === null || parent === void 0 ? void 0 : parent.node) !== null && _a !== void 0 ? _a : getNodeFromSelection(selection);
    var pos = (_b = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _b !== void 0 ? _b : selection === null || selection === void 0 ? void 0 : selection.from;
    var command = useCallback(function (name) { return dispatch(actions.executeCommand(name, viewId)); }, [stateId, viewId]);
    if (!node || pos == null)
        return null;
    positionPopper();
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, { node: node, pos: pos })); };
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "rowAbove", onClick: function () { return command(CommandNames.add_row_before); } }),
        React.createElement(MenuIcon, { kind: "rowBelow", onClick: function () { return command(CommandNames.add_row_after); } }),
        React.createElement(MenuIcon, { kind: "colLeft", onClick: function () { return command(CommandNames.add_column_before); } }),
        React.createElement(MenuIcon, { kind: "colRight", onClick: function () { return command(CommandNames.add_column_after); } }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "rowDelete", onClick: function () { return command(CommandNames.delete_row); }, dangerous: true }),
        React.createElement(MenuIcon, { kind: "colDelete", onClick: function () { return command(CommandNames.delete_column); }, dangerous: true }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
};
export default TableActions;
//# sourceMappingURL=TableActions.js.map