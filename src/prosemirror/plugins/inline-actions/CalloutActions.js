import React from 'react';
import { makeStyles, createStyles, Grid, } from '@material-ui/core';
import { findParentNode } from 'prosemirror-utils';
import MenuIcon from '../../../components/Menu/Icon';
import { liftContentOutOfNode, setNodeViewDelete, setNodeViewKind } from '../../../store/actions';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        width: 'fit-content',
        fontSize: 20,
        flexWrap: 'nowrap',
    },
    popover: {
        overflow: 'visible',
    },
}); });
var CalloutActions = function (props) {
    var view = props.view;
    var classes = useStyles();
    var schema = view.state.schema;
    var p = findParentNode(function (n) { return n.type === schema.nodes.callout; })(view.state.selection);
    var _a = view.state.selection, node = _a.node, from = _a.from;
    if (node && node.type === schema.nodes.callout) {
        p = { node: node, pos: from };
    }
    if (!p)
        return null;
    var onKind = setNodeViewKind(p.node, view, p === null || p === void 0 ? void 0 : p.pos, false);
    var doKind = function (a) { return function () { return onKind(a); }; };
    var onDelete = setNodeViewDelete(p.node, view, p === null || p === void 0 ? void 0 : p.pos);
    var onLift = liftContentOutOfNode(p.node, view, p === null || p === void 0 ? void 0 : p.pos);
    var kind = p.node.attrs.kind;
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "info", active: kind === 'info', onClick: doKind('info') }),
        React.createElement(MenuIcon, { kind: "success", active: kind === 'success', onClick: doKind('success') }),
        React.createElement(MenuIcon, { kind: "active", active: kind === 'active', onClick: doKind('active') }),
        React.createElement(MenuIcon, { kind: "warning", active: kind === 'warning', onClick: doKind('warning') }),
        React.createElement(MenuIcon, { kind: "danger", active: kind === 'danger', onClick: doKind('danger') }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "lift", onClick: onLift }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
};
export default CalloutActions;
//# sourceMappingURL=CalloutActions.js.map