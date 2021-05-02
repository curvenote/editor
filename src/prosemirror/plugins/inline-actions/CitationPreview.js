import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import Citation from '../../../components/Citation';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        width: 500,
        padding: 15,
    },
}); });
var CitationPreview = function (props) {
    var view = props.view;
    var node = view.state.selection.node;
    var classes = useStyles();
    if (!isNodeSelection(view.state.selection))
        return null;
    return (React.createElement("div", { className: classes.root },
        React.createElement(Citation, { uid: node.attrs.key })));
};
export default CitationPreview;
//# sourceMappingURL=CitationPreview.js.map