import React from 'react';
import { MenuItem, Typography } from '@material-ui/core';
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
export var Action = function (props) {
    var kind = props.kind, title = props.title, action = props.action, disabled = props.disabled;
    var click = action !== null && action !== void 0 ? action : (function () { return null; });
    var Icon = icons[kind];
    return (React.createElement(MenuItem, { onClick: click, disabled: disabled },
        React.createElement(Typography, null,
            Icon && (React.createElement(Icon, { fontSize: "small", style: {
                    position: 'relative', top: 3, marginRight: 10, color: '#aaa',
                }, color: "inherit" })), " " + title)));
};
Action.defaultProps = {
    title: '',
    action: function () { return null; },
    disabled: false,
};
export default Action;
//# sourceMappingURL=Action.js.map