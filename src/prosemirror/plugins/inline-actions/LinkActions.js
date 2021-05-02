import React, { useCallback } from 'react';
import { makeStyles, createStyles, Grid, Button, Tooltip, } from '@material-ui/core';
import MenuIcon from '../../../components/Menu/Icon';
import { getLinkBoundsIfTheyExist } from '../../../store/actions';
import schema from '../../schema';
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
    var view = props.view;
    var state = view.state;
    var linkBounds = getLinkBoundsIfTheyExist(state);
    if (!linkBounds)
        return null;
    var href = linkBounds.mark.attrs.href;
    var mark = schema.marks.link;
    var onDelete = function () { return (view.dispatch(state.tr.removeMark(linkBounds.from, linkBounds.to, mark))); };
    var onEdit = function () {
        var newHref = prompt('What is the new link?', href);
        if (!newHref)
            return;
        var link = mark.create({ href: newHref });
        var tr = state.tr
            .removeMark(linkBounds.from, linkBounds.to, mark)
            .addMark(linkBounds.from, linkBounds.to, link);
        view.dispatch(tr);
    };
    var classes = useStyles();
    var onOpen = useCallback(function () { return window.open(href, '_blank'); }, [href]);
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.grid },
        React.createElement(Tooltip, { title: href },
            React.createElement(Button, { className: classes.button, onClick: onEdit !== null && onEdit !== void 0 ? onEdit : undefined, size: "small", disableElevation: true }, "Edit Link")),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "open", onClick: onOpen }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "unlink", onClick: onDelete !== null && onDelete !== void 0 ? onDelete : undefined, dangerous: true })));
};
export default LinkActions;
//# sourceMappingURL=LinkActions.js.map