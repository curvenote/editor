import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { getEditorUIStateAndViewIds, getEditorView, getInlineActionAnchorEl, getInlineActionKind, getInlineActionPlacement, isInlineActionOpen, } from '../../store/selectors';
import { SelectionKinds } from '../../store/ui/types';
import { isEditable } from '../../prosemirror/plugins/editable';
import { createPopperLocationCache, registerPopper } from './utils';
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
    var _a;
    var children = props.children;
    var classes = useStyles();
    var cache = useMemo(createPopperLocationCache, []);
    var viewId = useSelector(getEditorUIStateAndViewIds, isEqual).viewId;
    var kind = useSelector(getInlineActionKind);
    var currentEl = useSelector(getInlineActionAnchorEl);
    var placement = useSelector(getInlineActionPlacement);
    var open = useSelector(isInlineActionOpen);
    var view = useSelector(function (state) { return getEditorView(state, viewId).view; });
    var edit = isEditable(view === null || view === void 0 ? void 0 : view.state);
    var showRegardless = kind && alwaysShow.has(kind);
    cache.setNode(currentEl);
    if (!open || !(edit || showRegardless) || !view || !((_a = cache.getNode()) === null || _a === void 0 ? void 0 : _a.isConnected))
        return null;
    return (React.createElement(Popper, { open: open, anchorEl: cache.anchorEl, transition: true, placement: placement, popperRef: function (pop) { return registerPopper(pop); }, className: "noprint above-modals" },
        React.createElement(Paper, { className: classes.paper, elevation: 10 },
            React.createElement("div", { className: classes.div }, children))));
};
export default InlineActions;
//# sourceMappingURL=Popper.js.map