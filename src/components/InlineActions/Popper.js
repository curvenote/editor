import React from 'react';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { useSelector } from 'react-redux';
import { getEditorUIStateAndViewIds, getEditorView, getInlineActionAnchorEl, getInlineActionKind, getInlineActionPlacement, isInlineActionOpen, } from '../../store/selectors';
import { SelectionKinds } from '../../store/ui/types';
import { isEditable } from '../../prosemirror/plugins/editable';
import { usePopper } from './hooks';
var useStyles = makeStyles(function () {
    return createStyles({
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
    });
});
var alwaysShow = new Set([SelectionKinds.cite]);
function InlineActions(props) {
    var children = props.children;
    var classes = useStyles();
    var viewId = useSelector(getEditorUIStateAndViewIds, isEqual).viewId;
    var kind = useSelector(getInlineActionKind);
    var currentEl = useSelector(getInlineActionAnchorEl);
    var placement = useSelector(getInlineActionPlacement);
    var open = useSelector(isInlineActionOpen);
    var view = useSelector(function (state) { return getEditorView(state, viewId).view; });
    var edit = isEditable(view === null || view === void 0 ? void 0 : view.state);
    var showRegardless = kind && alwaysShow.has(kind);
    var popperRef = usePopper(currentEl)[0];
    if (!open || !(edit || showRegardless) || !view || !(currentEl === null || currentEl === void 0 ? void 0 : currentEl.isConnected))
        return null;
    return (React.createElement(Popper, { open: open, anchorEl: currentEl, transition: true, placement: placement, popperRef: popperRef, className: "noprint above-modals" },
        React.createElement(Paper, { className: classes.paper, elevation: 10 },
            React.createElement("div", { className: classes.div }, children))));
}
export default InlineActions;
//# sourceMappingURL=Popper.js.map