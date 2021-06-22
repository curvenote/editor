import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { deleteNode, updateNodeAttrs } from '../../store/actions';
import SelectWidth from './SelectWidth';
import { positionPopper } from './utils';
import { getEditorState } from '../../store/selectors';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            width: 'fit-content',
            fontSize: 20,
            flexWrap: 'nowrap',
        },
    });
});
var AlignActions = function (props) {
    var _a;
    var stateId = props.stateId, viewId = props.viewId, anchorEl = props.anchorEl, showCaption = props.showCaption;
    var dispatch = useDispatch();
    var classes = useStyles();
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    var _b = (_a = selection) !== null && _a !== void 0 ? _a : {}, node = _b.node, pos = _b.from;
    if (!node || !selection || !isNodeSelection(selection))
        return null;
    var _c = node === null || node === void 0 ? void 0 : node.attrs, align = _c.align, width = _c.width, numbered = _c.numbered, caption = _c.caption;
    var onAlign = function (a) { return function () {
        dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { align: a }));
    }; };
    var onWidth = function (value) {
        dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { width: value }));
    };
    var onNumbered = function () {
        return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { numbered: !numbered }));
    };
    var onCaption = function () {
        return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { caption: !caption }));
    };
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, { node: node, pos: pos })); };
    positionPopper(anchorEl);
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "left", active: align === 'left', onClick: onAlign('left') }),
        React.createElement(MenuIcon, { kind: "center", active: align === 'center', onClick: onAlign('center') }),
        React.createElement(MenuIcon, { kind: "right", active: align === 'right', onClick: onAlign('right') }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(SelectWidth, { width: width, onWidth: onWidth }),
        showCaption && (React.createElement(React.Fragment, null,
            React.createElement(MenuIcon, { kind: "divider" }),
            React.createElement(MenuIcon, { kind: "caption", active: caption, onClick: onCaption }),
            caption && React.createElement(MenuIcon, { kind: "numbered", active: numbered, onClick: onNumbered }))),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
};
AlignActions.defaultProps = {
    showCaption: false,
};
export default AlignActions;
//# sourceMappingURL=AlignActions.js.map