import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper } from '@material-ui/core';
import { getEditorUI } from '../../../store/selectors';
import LinkActions from './LinkActions';
import AlignActions from './AlignActions';
import { SelectionKinds } from './types';
import CitationPreview from './CitationPreview';
import CalloutActions from './CalloutActions';
import TimeActions from './TimeActions';
var useStyles = makeStyles(function () { return createStyles({
    paper: {
        marginTop: 5,
        marginBottom: 5,
        overflow: 'hidden',
    },
    div: {
        opacity: 0.7,
        transition: 'opacity ease 0.3s',
        '&:hover': {
            opacity: 1,
        },
    },
}); });
var alwaysShow = new Set([SelectionKinds.cite]);
var LinkToolbar = function (props) {
    var view = props.view, open = props.open, edit = props.edit, kind = props.kind;
    var classes = useStyles();
    var selectedId = useSelector(function (state) { return getEditorUI(state).viewId; });
    var selected = selectedId === view.dom.id;
    var showRegardless = (kind && alwaysShow.has(kind));
    if (!open || !(edit || showRegardless) || !selected)
        return null;
    return (React.createElement(Paper, { className: classes.paper, elevation: 10 },
        React.createElement("div", { className: classes.div },
            kind === SelectionKinds.link && React.createElement(LinkActions, { view: view }),
            kind === SelectionKinds.image && React.createElement(AlignActions, { view: view }),
            kind === SelectionKinds.iframe && React.createElement(AlignActions, { view: view }),
            kind === SelectionKinds.callout && React.createElement(CalloutActions, { view: view }),
            kind === SelectionKinds.cite && React.createElement(CitationPreview, { view: view }),
            kind === SelectionKinds.time && React.createElement(TimeActions, { view: view }))));
};
export default LinkToolbar;
//# sourceMappingURL=Toolbar.js.map