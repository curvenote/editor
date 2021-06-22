import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { getEditorUIStateAndViewIds, getEditorView, getInlineActionAnchorEl, getInlineActionKind, getInlineActionPlacement, isInlineActionOpen, } from '../../store/selectors';
import { SelectionKinds } from '../../store/ui/types';
import { isEditable } from '../../prosemirror/plugins/editable';
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
var InlineActions = function (props) {
    var children = props.children;
    var classes = useStyles();
    var viewId = useSelector(function (state) { return getEditorUIStateAndViewIds(state); }, isEqual).viewId;
    var kind = useSelector(function (state) { return getInlineActionKind(state); });
    var anchorEl = useSelector(function (state) { return getInlineActionAnchorEl(state); });
    var placement = useSelector(function (state) { return getInlineActionPlacement(state); });
    var open = useSelector(function (state) { return isInlineActionOpen(state); });
    var view = useSelector(function (state) { return getEditorView(state, viewId).view; });
    var edit = isEditable(view === null || view === void 0 ? void 0 : view.state);
    var showRegardless = kind && alwaysShow.has(kind);
    if (!open || !(edit || showRegardless) || !view || !(anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.isConnected))
        return null;
    return (React.createElement(Popper, { open: open, anchorEl: anchorEl, transition: true, placement: placement, className: "noprint above-modals" },
        React.createElement(Paper, { className: classes.paper, elevation: 10 },
            React.createElement("div", { className: classes.div }, children))));
};
export default InlineActions;
//# sourceMappingURL=Popper.js.map