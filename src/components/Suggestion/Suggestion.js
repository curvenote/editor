import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import scrollIntoView from 'scroll-into-view-if-needed';
var HIGHLIGHT_COLOR = '#e8e8e8';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        padding: 10,
        cursor: 'pointer',
    },
}); });
var Suggestion = function (props) {
    var selected = props.selected, onClick = props.onClick, onHover = props.onHover, children = props.children, className = props.className;
    var classes = useStyles();
    return (React.createElement("div", { className: classes.root + " " + (className !== null && className !== void 0 ? className : ''), onClick: onClick, onMouseEnter: onHover, style: selected ? { backgroundColor: HIGHLIGHT_COLOR } : {}, ref: selected ? function (el) {
            var _a;
            if (el == null)
                return;
            scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed', boundary: (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement });
        } : null }, children));
};
export default Suggestion;
//# sourceMappingURL=Suggestion.js.map