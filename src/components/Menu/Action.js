import React from 'react';
import { createStyles, makeStyles, MenuItem, Typography } from '@material-ui/core';
import FunctionsIcon from '@material-ui/icons/Functions';
import CodeIcon from '@material-ui/icons/Code';
import RemoveIcon from '@material-ui/icons/Remove';
import YouTubeIcon from '@material-ui/icons/YouTube';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import LinkIcon from '@material-ui/icons/Link';
var icons = {
    math: FunctionsIcon,
    code: CodeIcon,
    hr: RemoveIcon,
    youtube: YouTubeIcon,
    video: OndemandVideoIcon,
    iframe: WebAssetIcon,
    link: LinkIcon,
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
            Icon && React.createElement(Icon, { fontSize: "small", className: classes.icon, color: "inherit" }), " " + title),
        children));
};
MenuAction.defaultProps = {
    kind: undefined,
    title: '',
    action: undefined,
    disabled: false,
    selected: false,
};
export default MenuAction;
//# sourceMappingURL=Action.js.map