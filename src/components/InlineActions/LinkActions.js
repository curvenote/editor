import React, { useCallback, useState } from 'react';
import { makeStyles, createStyles, Grid, Button, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, getLinkBoundsIfTheyExist, removeMark, testLink, testLinkWeak, } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import TextAction from './TextAction';
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
export function useLinkActions(stateId, viewId) {
    var _a;
    var dispatch = useDispatch();
    var state = useSelector(function (s) { var _a; return (_a = getEditorState(s, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var linkBounds = getLinkBoundsIfTheyExist(state);
    var attrs = (_a = linkBounds === null || linkBounds === void 0 ? void 0 : linkBounds.mark.attrs) !== null && _a !== void 0 ? _a : null;
    var mark = state === null || state === void 0 ? void 0 : state.schema.marks.link;
    var onOpen = useCallback(function () { return window.open(attrs === null || attrs === void 0 ? void 0 : attrs.href, '_blank'); }, [attrs === null || attrs === void 0 ? void 0 : attrs.href]);
    var onDelete = useCallback(function () {
        if (!linkBounds || !mark)
            return;
        dispatch(removeMark(stateId, viewId, mark, linkBounds.from, linkBounds.to));
    }, [stateId, viewId, linkBounds, mark]);
    var onEdit = useCallback(function (newHref) {
        if (!newHref || !linkBounds || !state || !mark)
            return;
        var link = mark.create({ href: testLink(newHref) ? newHref : "http://" + newHref });
        var tr = state.tr
            .removeMark(linkBounds.from, linkBounds.to, mark)
            .addMark(linkBounds.from, linkBounds.to, link);
        dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
    }, [stateId, viewId, linkBounds, mark]);
    var tooltip = (attrs === null || attrs === void 0 ? void 0 : attrs.title) ? attrs.title + " <" + (attrs === null || attrs === void 0 ? void 0 : attrs.href) + ">" : attrs === null || attrs === void 0 ? void 0 : attrs.href;
    return {
        attrs: attrs !== null && attrs !== void 0 ? attrs : null,
        tooltip: tooltip !== null && tooltip !== void 0 ? tooltip : '',
        bounds: linkBounds,
        onOpen: onOpen,
        onDelete: onDelete,
        onEdit: onEdit,
    };
}
var LinkActions = function (props) {
    var _a;
    var stateId = props.stateId, viewId = props.viewId;
    var _b = useState(false), labelOpen = _b[0], setLabelOpen = _b[1];
    var classes = useStyles();
    var link = useLinkActions(stateId, viewId);
    if (!link)
        return null;
    var attrs = link.attrs, onEdit = link.onEdit, onOpen = link.onOpen, onDelete = link.onDelete;
    if (labelOpen) {
        return (React.createElement(TextAction, { text: (_a = attrs === null || attrs === void 0 ? void 0 : attrs.href) !== null && _a !== void 0 ? _a : '', onCancel: function () { return setLabelOpen(false); }, onSubmit: function (t) {
                onEdit(t);
                setLabelOpen(false);
            }, validate: testLinkWeak, help: "Please provide a valid URL" }));
    }
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.grid },
        React.createElement(Tooltip, { title: link.tooltip },
            React.createElement(Button, { className: classes.button, onClick: function () { return setLabelOpen(true); }, size: "small", disableElevation: true }, "Edit Link")),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "open", onClick: onOpen }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "unlink", onClick: onDelete !== null && onDelete !== void 0 ? onDelete : undefined, dangerous: true })));
};
export default LinkActions;
//# sourceMappingURL=LinkActions.js.map