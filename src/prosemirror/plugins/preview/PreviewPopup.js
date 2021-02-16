import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, } from '@material-ui/core';
import { getEditorUI } from '../../../store/selectors';
import Citation from '../../../components/Citation';
var useStyles = makeStyles(function () { return createStyles({
    paper: {
        width: 500,
        padding: 15,
    },
}); });
var PreviewPopup = function (props) {
    var viewId = props.viewId, open = props.open, edit = props.edit, uid = props.uid;
    var classes = useStyles();
    var selectedId = useSelector(function (state) { return getEditorUI(state).viewId; });
    var selected = selectedId === viewId;
    if (!open || !selected)
        return null;
    return (React.createElement(Paper, { className: classes.paper, elevation: 10 },
        React.createElement(Citation, { uid: uid })));
};
export default PreviewPopup;
//# sourceMappingURL=PreviewPopup.js.map