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
import { createStyles, makeStyles, MenuItem, SvgIcon, Typography } from '@material-ui/core';
import FunctionsIcon from '@material-ui/icons/Functions';
import CodeIcon from '@material-ui/icons/Code';
import RemoveIcon from '@material-ui/icons/Remove';
import YouTubeIcon from '@material-ui/icons/YouTube';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import LinkIcon from '@material-ui/icons/Link';
import ImageIcon from '@material-ui/icons/Image';
import GridIcon from '@material-ui/icons/GridOn';
function FootnoteIcon(props) {
    return (React.createElement(SvgIcon, __assign({}, props, { viewBox: "0 0 18 18" }),
        React.createElement("g", { fill: "none" },
            React.createElement("path", { d: "M17 5.884c-.214.22-.451.419-.7.585a.5.5 0 0 1-.555-.832C16.403 5.2 16.886 4.521 17 4v-.5h1v6a.5.5 0 0 1-1 0V5.884zm-6.136 9.012a.503.503 0 0 1-.371.146a.473.473 0 0 1-.36-.14a.536.536 0 0 1-.133-.378V6.608c0-.167.049-.303.146-.408a.51.51 0 0 1 .383-.158a.49.49 0 0 1 .378.158a.564.564 0 0 1 .152.408v3.054h.024a2.23 2.23 0 0 1 .834-.858c.357-.207.756-.31 1.199-.31c.799 0 1.444.298 1.935.895c.49.596.736 1.389.736 2.379c0 .994-.245 1.789-.736 2.385c-.491.592-1.142.889-1.954.889c-.454 0-.86-.104-1.217-.31a2.295 2.295 0 0 1-.846-.87h-.024v.662c0 .15-.049.274-.146.372zm2.026-.785c.56 0 1.002-.21 1.327-.627c.325-.422.487-.994.487-1.716c0-.718-.162-1.288-.487-1.71c-.325-.422-.767-.633-1.327-.633c-.54 0-.981.217-1.326.651c-.34.43-.511.994-.511 1.692c0 .702.17 1.268.51 1.698c.346.43.788.645 1.327.645zM2.571 15a.631.631 0 0 1-.412-.135a.448.448 0 0 1-.159-.35c0-.08.023-.183.07-.305l2.944-7.679c.135-.355.385-.532.749-.532c.342 0 .581.175.717.526l2.95 7.685c.047.122.07.224.07.306a.44.44 0 0 1-.165.349a.606.606 0 0 1-.406.134c-.27 0-.457-.14-.558-.422l-.813-2.19H3.935l-.806 2.19c-.101.281-.287.422-.558.422zm1.694-3.55h2.97L5.769 7.426h-.038L4.265 11.45z", fill: "currentColor" }))));
}
var icons = {
    math: FunctionsIcon,
    code: CodeIcon,
    image: ImageIcon,
    hr: RemoveIcon,
    footnote: FootnoteIcon,
    youtube: YouTubeIcon,
    video: OndemandVideoIcon,
    iframe: WebAssetIcon,
    link: LinkIcon,
    table: GridIcon,
};
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            minWidth: 115,
        },
        icon: {
            position: 'relative',
            top: 3,
            marginRight: 10,
            color: '#aaa',
        },
    });
});
var MenuAction = function (props) {
    var kind = props.kind, title = props.title, action = props.action, disabled = props.disabled, children = props.children, selected = props.selected;
    var classes = useStyles();
    var Icon = kind && icons[kind];
    return (React.createElement(MenuItem, { onClick: action, disabled: disabled, selected: selected },
        React.createElement(Typography, { className: classes.root },
            Icon && React.createElement(Icon, { fontSize: "small", className: classes.icon, color: "inherit" }), " ".concat(title)),
        children));
};
export default MenuAction;
//# sourceMappingURL=Action.js.map