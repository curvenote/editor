import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { deleteNode, updateNodeAttrs } from '../../store/actions';
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
var AlignActions = function (props) {
    var stateId = props.stateId, viewId = props.viewId, showCaption = props.showCaption;
    var dispatch = useDispatch();
    var classes = useStyles();
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    var node = getNodeFromSelection(selection);
    if (!node || !selection || !isNodeSelection(selection))
        return null;
    var pos = selection.from;
    var _a = node === null || node === void 0 ? void 0 : node.attrs, align = _a.align, width = _a.width, numbered = _a.numbered, caption = _a.caption;
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
    positionPopper();
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.root },
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