import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Grid, Popover, Slider, } from '@material-ui/core';
import MenuIcon from '../../../components/Menu/Icon';
import { getEditorUI } from '../../../store/ui/selectors';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        width: 'fit-content',
        fontSize: 20,
    },
    paper: {
        position: 'absolute',
        width: 215,
        overflow: 'hidden',
        height: 38,
        zIndex: 1,
    },
    popover: {
        overflow: 'visible',
    },
}); });
var ImageToolbar = function (props) {
    var viewId = props.viewId, open = props.open, width = props.width, align = props.align, onAlign = props.onAlign, onWidth = props.onWidth, onDelete = props.onDelete;
    var classes = useStyles();
    var selectedId = useSelector(function (state) { return getEditorUI(state).viewId; });
    var selected = selectedId === viewId;
    var doAlign = function (a) { return function () { return onAlign(a); }; };
    var _a = React.useState(null), anchorEl = _a[0], setAnchorEl = _a[1];
    var handleClick = function (event) {
        setAnchorEl(event.currentTarget);
    };
    var handleClose = function () { return setAnchorEl(null); };
    var openWidth = Boolean(anchorEl);
    if (!selected)
        return null;
    if (!open && !openWidth)
        return null;
    var margin = align === 'right' ? "0 min(calc(" + (100 - width / 2) + "% - 100px), calc(100% - 200px))" : "0 calc(" + width / 2 + "% - 100px)";
    return (React.createElement(Paper, { className: classes.paper, elevation: 10, style: {
            margin: align === 'center' ? '0 calc(50% - 100px)' : margin,
        } },
        React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
            React.createElement(MenuIcon, { kind: "left", active: align === 'left', onClick: doAlign('left') }),
            React.createElement(MenuIcon, { kind: "center", active: align === 'center', onClick: doAlign('center') }),
            React.createElement(MenuIcon, { kind: "right", active: align === 'right', onClick: doAlign('right') }),
            React.createElement(MenuIcon, { kind: "divider" }),
            React.createElement(MenuIcon, { kind: "imageWidth", active: openWidth, onClick: handleClick }),
            React.createElement(Popover, { open: openWidth, anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center',
                }, transformOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                } },
                React.createElement("div", { style: { width: 120, padding: '5px 25px' } },
                    React.createElement(Slider, { defaultValue: width, step: 10, marks: true, min: 10, max: 100, onChangeCommitted: function (e, v) { handleClose(); onWidth(v); } }))),
            React.createElement(MenuIcon, { kind: "divider" }),
            React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true }))));
};
export default ImageToolbar;
//# sourceMappingURL=ImageToolbar.js.map