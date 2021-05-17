import React, { useCallback, useState } from 'react';
import { makeStyles, createStyles, Grid, Button, Tooltip, } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, getLinkBoundsIfTheyExist, removeMark, testLink, testLinkWeak, } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import TextAction from './TextAction';
var useStyles = makeStyles(function () { return createStyles({
    grid: {
        width: 'fit-content',
        fontSize: 20,
    },
    button: {
        marginLeft: 5,
    },
}); });
var LinkActions = function (props) {
    var _a, _b;
    var stateId = props.stateId, viewId = props.viewId;
    var dispatch = useDispatch();
    var _c = useState(false), labelOpen = _c[0], setLabelOpen = _c[1];
    var classes = useStyles();
    var state = useSelector(function (s) { var _a; return (_a = getEditorState(s, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    if (!state)
        return null;
    var linkBounds = getLinkBoundsIfTheyExist(state);
    var href = (_b = (_a = linkBounds === null || linkBounds === void 0 ? void 0 : linkBounds.mark) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.href;
    var onOpen = useCallback(function () { return window.open(href, '_blank'); }, [href]);
    if (!linkBounds)
        return null;
    var mark = state.schema.marks.link;
    var onDelete = function () { return (dispatch(removeMark(stateId, viewId, mark, linkBounds.from, linkBounds.to))); };
    var onEdit = function (newHref) {
        if (!newHref)
            return;
        var link = mark.create({ href: testLink(newHref) ? newHref : "http://" + newHref });
        var tr = state.tr
            .removeMark(linkBounds.from, linkBounds.to, mark)
            .addMark(linkBounds.from, linkBounds.to, link);
        dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
    };
    if (labelOpen) {
        return (React.createElement(TextAction, { text: href, onCancel: function () { return setLabelOpen(false); }, onSubmit: function (t) { onEdit(t); setLabelOpen(false); }, validate: testLinkWeak, help: "Please provide a valid URL" }));
    }
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.grid },
        React.createElement(Tooltip, { title: href },
            React.createElement(Button, { className: classes.button, onClick: function () { return setLabelOpen(true); }, size: "small", disableElevation: true }, "Edit Link")),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "open", onClick: onOpen }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "unlink", onClick: onDelete !== null && onDelete !== void 0 ? onDelete : undefined, dangerous: true })));
};
export default LinkActions;
//# sourceMappingURL=LinkActions.js.map