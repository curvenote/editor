import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import { useSelector } from 'react-redux';
import Citation from '../Citation';
import { getEditorState } from '../../store/selectors';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        width: 500,
        padding: 15,
    },
}); });
var CitationPreview = function (props) {
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    if (!selection || !isNodeSelection(selection))
        return null;
    var node = selection.node;
    if (!isNodeSelection(selection))
        return null;
    return (React.createElement("div", { className: classes.root },
        React.createElement(Citation, { uid: node.attrs.key })));
};
export default CitationPreview;
//# sourceMappingURL=CitationPreview.js.map