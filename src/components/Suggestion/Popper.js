import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper, } from '@material-ui/core';
import { selectors } from '../../store';
import { SUGGESTION_ID } from '../../prosemirror/plugins/suggestion';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        minWidth: 300,
        maxWidth: 500,
        maxHeight: 350,
        overflowY: 'scroll',
        margin: '10px 0',
    },
}); });
var Suggestion = function (props) {
    var children = props.children;
    var open = useSelector(function (state) { return selectors.isSuggestionOpen(state); });
    var classes = useStyles();
    var anchorEl = document.getElementById(SUGGESTION_ID);
    if (!open || !anchorEl)
        return null;
    return (React.createElement(Popper, { className: "above-modals", open: open, anchorEl: anchorEl, placement: "bottom-start" },
        React.createElement(Paper, { className: classes.root, elevation: 10 }, children)));
};
export default Suggestion;
//# sourceMappingURL=Popper.js.map