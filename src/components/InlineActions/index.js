var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper, } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { getEditorUI, getEditorView } from '../../store/selectors';
import LinkActions from './LinkActions';
import AlignActions from './AlignActions';
import { SelectionKinds } from '../../store/ui/types';
import CitationPreview from './CitationPreview';
import CalloutActions from './CalloutActions';
import TimeActions from './TimeActions';
import HeadingActions from './HeadingActions';
import { isEditable } from '../../prosemirror/plugins/editable';
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
var Toolbar = function () {
    var classes = useStyles();
    var stateId = useSelector(function (state) { return getEditorUI(state).stateId; });
    var viewId = useSelector(function (state) { return getEditorUI(state).viewId; });
    var selection = useSelector(function (state) { return getEditorUI(state).selection; }, isEqual);
    var view = useSelector(function (state) { return getEditorView(state, viewId).view; });
    var edit = isEditable(view === null || view === void 0 ? void 0 : view.state);
    var open = selection != null;
    var _a = selection !== null && selection !== void 0 ? selection : {}, kind = _a.kind, anchorEl = _a.anchorEl, placement = _a.placement;
    var showRegardless = (kind && alwaysShow.has(kind));
    if (!open || !(edit || showRegardless) || !view || !(anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.isConnected))
        return null;
    return (React.createElement(Popper, { open: open, anchorEl: anchorEl, transition: true, placement: placement, className: "noprint above-modals" },
        React.createElement(Paper, { className: classes.paper, elevation: 10 },
            React.createElement("div", { className: classes.div },
                kind === SelectionKinds.link && React.createElement(LinkActions, __assign({}, { stateId: stateId, viewId: viewId, anchorEl: anchorEl })),
                kind === SelectionKinds.image && React.createElement(AlignActions, __assign({ showCaption: true }, { stateId: stateId, viewId: viewId, anchorEl: anchorEl })),
                kind === SelectionKinds.iframe && React.createElement(AlignActions, __assign({}, { stateId: stateId, viewId: viewId, anchorEl: anchorEl })),
                kind === SelectionKinds.callout && React.createElement(CalloutActions, __assign({}, { stateId: stateId, viewId: viewId, anchorEl: anchorEl })),
                kind === SelectionKinds.heading && React.createElement(HeadingActions, __assign({}, { stateId: stateId, viewId: viewId, anchorEl: anchorEl })),
                kind === SelectionKinds.cite && React.createElement(CitationPreview, __assign({}, { stateId: stateId, viewId: viewId, anchorEl: anchorEl })),
                kind === SelectionKinds.time && React.createElement(TimeActions, __assign({}, { stateId: stateId, viewId: viewId, anchorEl: anchorEl }))))));
};
export default Toolbar;
//# sourceMappingURL=index.js.map