import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils1';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, deleteNode, updateNodeAttrs, createFigure, } from '../../store/actions';
import SelectWidth from './SelectWidth';
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
function ImageActions(props) {
    var stateId = props.stateId, viewId = props.viewId;
    var dispatch = useDispatch();
    var classes = useStyles();
    var editorState = useSelector(function (state) { var _a; return (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var selection = editorState === null || editorState === void 0 ? void 0 : editorState.selection;
    var node = getNodeFromSelection(selection);
    if (!editorState || !node || !selection || !isNodeSelection(selection))
        return null;
    var pos = selection.from;
    var width = node.attrs.width;
    var onWidth = function (value) {
        dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { width: value }));
    };
    var onCaption = function () {
        var figure = createFigure(editorState.schema, node, true);
        var tr = editorState.tr.replaceSelectionWith(figure);
        dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
    };
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, { node: node, pos: pos })); };
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.root },
        React.createElement(SelectWidth, { width: width, onWidth: onWidth }),
        React.createElement(MenuIcon, { kind: "caption", onClick: onCaption }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
}
export default ImageActions;
//# sourceMappingURL=ImageActions.js.map