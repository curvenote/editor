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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles, createStyles, Grid, Button, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { NodeSelection } from 'prosemirror-state';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, deleteNode, switchLinkType } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import TextAction from './TextAction';
import { LinkTypeSelect } from './LinkTypeSelect';
var useStyles = makeStyles(function () {
    return createStyles({
        grid: {
            width: 'fit-content',
            fontSize: 20,
        },
        button: {
            marginLeft: 5,
        },
    });
});
export function useLinkBlockActions(stateId, viewId) {
    var _a, _b, _c;
    var dispatch = useDispatch();
    var state = useSelector(function (s) { var _a; return (_a = getEditorState(s, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var selection = useMemo(function () {
        try {
            return (state === null || state === void 0 ? void 0 : state.doc) ? NodeSelection.create(state.doc, state.selection.from) : null;
        }
        catch (e) {
            return undefined;
        }
    }, [state]);
    var node = selection === null || selection === void 0 ? void 0 : selection.node;
    var attrs = node === null || node === void 0 ? void 0 : node.attrs;
    var from = selection === null || selection === void 0 ? void 0 : selection.from;
    var url = ((_b = (_a = selection === null || selection === void 0 ? void 0 : selection.node) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.url) || '';
    var onOpen = useCallback(function () {
        if (!url)
            return;
        window.open(url, '_blank');
    }, [url]);
    var onDelete = useCallback(function () {
        if (typeof from === 'undefined' || !node)
            return;
        dispatch(deleteNode(stateId, viewId, { node: node, pos: from }));
    }, [stateId, viewId, node, from, dispatch]);
    var onEdit = useCallback(function (newHref) {
        if (!state || !node || typeof from === 'undefined' || !newHref)
            return;
        if (newHref === node.attrs.url)
            return;
        var newNode = state.schema.nodes.link_block.createAndFill(__assign(__assign({}, node.attrs), { url: newHref }));
        var tr = state.tr.replaceRangeWith(from, from + node.nodeSize, newNode);
        dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
    }, [stateId, viewId, node, from, state, dispatch]);
    var tooltip = (attrs === null || attrs === void 0 ? void 0 : attrs.title) ? "".concat(attrs.title, " <").concat(attrs === null || attrs === void 0 ? void 0 : attrs.url, ">") : attrs === null || attrs === void 0 ? void 0 : attrs.url;
    return {
        attrs: (_c = node === null || node === void 0 ? void 0 : node.attrs) !== null && _c !== void 0 ? _c : null,
        tooltip: tooltip !== null && tooltip !== void 0 ? tooltip : '',
        onOpen: onOpen,
        onDelete: onDelete,
        onEdit: onEdit,
        node: node,
    };
}
function isValidUrl(str) {
    var url;
    try {
        url = new URL(str);
    }
    catch (_) {
        return false;
    }
    return !!url;
}
function LinkBlockActions(props) {
    var _a;
    var stateId = props.stateId, viewId = props.viewId;
    var _b = useState(false), labelOpen = _b[0], setLabelOpen = _b[1];
    var dispatch = useDispatch();
    var classes = useStyles();
    var link = useLinkBlockActions(stateId, viewId);
    var attrs = link.attrs, onEdit = link.onEdit, onOpen = link.onOpen, onDelete = link.onDelete, node = link.node;
    useEffect(function () {
        setLabelOpen(false);
    }, [node]);
    if (labelOpen) {
        var text = (_a = attrs === null || attrs === void 0 ? void 0 : attrs.url) !== null && _a !== void 0 ? _a : '';
        return (React.createElement(TextAction, { text: text, onCancel: function () { return setLabelOpen(false); }, onSubmit: function (t) {
                onEdit(t);
                setLabelOpen(false);
            }, validate: isValidUrl, help: "Please provide a valid URL" }));
    }
    if (!stateId || !viewId)
        return null;
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.grid },
        React.createElement("div", { style: { marginLeft: 10 } },
            React.createElement(LinkTypeSelect, { value: "link-block", onChange: function (value) {
                    if (value === 'link') {
                        dispatch(switchLinkType({ linkType: 'link', stateId: stateId, viewId: viewId, url: node === null || node === void 0 ? void 0 : node.attrs.url }));
                    }
                } })),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(Tooltip, { title: link.tooltip },
            React.createElement(Button, { className: classes.button, onClick: function () { return setLabelOpen(true); }, size: "small", disableElevation: true }, "Edit Link")),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "open", onClick: onOpen }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete !== null && onDelete !== void 0 ? onDelete : undefined, dangerous: true })));
}
export default LinkBlockActions;
//# sourceMappingURL=LinkBlockActions.js.map