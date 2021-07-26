import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { findParentNode } from 'prosemirror-utils';
import { schemas } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { deleteNode, liftContentOutOfNode, updateNodeAttrs } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import { positionPopper } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';
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
var CalloutActions = function (props) {
    var _a, _b;
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var dispatch = useDispatch();
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    var parent = selection && findParentNode(function (n) { return n.type.name === schemas.nodeNames.callout; })(selection);
    var node = (_a = parent === null || parent === void 0 ? void 0 : parent.node) !== null && _a !== void 0 ? _a : getNodeFromSelection(selection);
    var pos = (_b = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _b !== void 0 ? _b : selection === null || selection === void 0 ? void 0 : selection.from;
    if (!node || pos == null)
        return null;
    positionPopper();
    var onKind = function (value) { return function () {
        return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { kind: value }, false));
    }; };
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, { node: node, pos: pos })); };
    var onLift = function () { return dispatch(liftContentOutOfNode(stateId, viewId, { node: node, pos: pos })); };
    var kind = node.attrs.kind;
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "info", active: kind === 'info', onClick: onKind('info') }),
        React.createElement(MenuIcon, { kind: "success", active: kind === 'success', onClick: onKind('success') }),
        React.createElement(MenuIcon, { kind: "active", active: kind === 'active', onClick: onKind('active') }),
        React.createElement(MenuIcon, { kind: "warning", active: kind === 'warning', onClick: onKind('warning') }),
        React.createElement(MenuIcon, { kind: "danger", active: kind === 'danger', onClick: onKind('danger') }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "lift", onClick: onLift }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
};
export default CalloutActions;
//# sourceMappingURL=CalloutActions.js.map