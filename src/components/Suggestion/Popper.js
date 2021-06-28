import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';
import { selectors } from '../../store';
import { SUGGESTION_ID } from '../../prosemirror/plugins/suggestion';
import { registerPopper } from '../InlineActions';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            minWidth: 300,
            maxWidth: 500,
            maxHeight: 350,
            overflowY: 'scroll',
            margin: '10px 0',
        },
    });
});
function getNode() {
    return document.getElementById(SUGGESTION_ID);
}
var anchorEl = {
    getBoundingClientRect: function () {
        var _a;
        return (_a = getNode()) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    },
    get clientWidth() {
        var _a, _b;
        return (_b = (_a = getNode()) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0;
    },
    get clientHeight() {
        var _a, _b;
        return (_b = (_a = getNode()) === null || _a === void 0 ? void 0 : _a.clientHeight) !== null && _b !== void 0 ? _b : 0;
    },
};
var Suggestion = function (props) {
    var children = props.children;
    var open = useSelector(function (state) { return selectors.isSuggestionOpen(state); });
    var classes = useStyles();
    if (!open || !getNode())
        return null;
    return (React.createElement(Popper, { className: "above-modals", open: open, anchorEl: anchorEl, popperRef: function (pop) { return registerPopper(pop); }, placement: "bottom-start" },
        React.createElement(Paper, { className: classes.root, elevation: 10 }, children)));
};
export default Suggestion;
//# sourceMappingURL=Popper.js.map