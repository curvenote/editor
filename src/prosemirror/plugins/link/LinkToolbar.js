import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Grid, Button, Tooltip, } from '@material-ui/core';
import MenuIcon from '../../../components/Menu/Icon';
import { getEditorUI } from '../../../store/selectors';
var useStyles = makeStyles(function () { return createStyles({
    paper: {
        overflow: 'hidden',
        height: 38,
    },
    grid: {
        width: 'fit-content',
        fontSize: 20,
    },
    button: {
        marginLeft: 5,
    },
}); });
var LinkToolbar = function (props) {
    var viewId = props.viewId, open = props.open, edit = props.edit, href = props.href, onEdit = props.onEdit, onDelete = props.onDelete;
    var classes = useStyles();
    var selectedId = useSelector(function (state) { return getEditorUI(state).viewId; });
    var selected = selectedId === viewId;
    var onOpen = useCallback(function () { return window.open(href, '_blank'); }, [href]);
    if (!open || !edit || !selected)
        return null;
    return (React.createElement(Paper, { className: classes.paper, elevation: 10 },
        React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.grid },
            React.createElement(Tooltip, { title: href },
                React.createElement(Button, { className: classes.button, onClick: onEdit !== null && onEdit !== void 0 ? onEdit : undefined, size: "small", disableElevation: true }, "Edit Link")),
            React.createElement(MenuIcon, { kind: "divider" }),
            React.createElement(MenuIcon, { kind: "open", onClick: onOpen }),
            React.createElement(MenuIcon, { kind: "divider" }),
            React.createElement(MenuIcon, { kind: "unlink", onClick: onDelete !== null && onDelete !== void 0 ? onDelete : undefined, dangerous: true }))));
};
export default LinkToolbar;
//# sourceMappingURL=LinkToolbar.js.map