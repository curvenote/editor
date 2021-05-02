import React from 'react';
import { makeStyles, createStyles, Grid, } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import MenuIcon from '../../../components/Menu/Icon';
import { setNodeViewAlign, setNodeViewDelete, setNodeViewWidth } from '../../../store/actions';
import SelectWidth from './SelectWidth';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        width: 'fit-content',
        fontSize: 20,
        flexWrap: 'nowrap',
    },
}); });
var AlignActions = function (props) {
    var view = props.view;
    var classes = useStyles();
    var _a = view.state.selection, node = _a.node, from = _a.from;
    var onAlign = setNodeViewAlign(node, view, from);
    var doAlign = function (a) { return function () { return onAlign(a); }; };
    var onWidth = setNodeViewWidth(node, view, from);
    var onDelete = setNodeViewDelete(node, view, from);
    if (!isNodeSelection(view.state.selection))
        return null;
    var _b = node.attrs, align = _b.align, width = _b.width;
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "left", active: align === 'left', onClick: doAlign('left') }),
        React.createElement(MenuIcon, { kind: "center", active: align === 'center', onClick: doAlign('center') }),
        React.createElement(MenuIcon, { kind: "right", active: align === 'right', onClick: doAlign('right') }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(SelectWidth, { width: width, onWidth: onWidth }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
};
export default AlignActions;
//# sourceMappingURL=AlignActions.js.map