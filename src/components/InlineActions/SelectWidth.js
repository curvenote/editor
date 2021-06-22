import React from 'react';
import { Popover, Slider } from '@material-ui/core';
import MenuIcon from '../Menu/Icon';
var SelectWidth = function (props) {
    var width = props.width, onWidth = props.onWidth;
    var _a = React.useState(null), anchorEl = _a[0], setAnchorEl = _a[1];
    var handleClick = function (event) {
        setAnchorEl(event.currentTarget);
    };
    var handleClose = function () { return setAnchorEl(null); };
    var openWidth = Boolean(anchorEl);
    return (React.createElement(React.Fragment, null,
        React.createElement(MenuIcon, { kind: "imageWidth", active: openWidth, onClick: handleClick }),
        React.createElement(Popover, { open: openWidth, anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'center',
            } },
            React.createElement("div", { style: { width: 120, padding: '5px 25px' } },
                React.createElement(Slider, { defaultValue: width, step: 10, marks: true, min: 10, max: 100, onChangeCommitted: function (e, v) {
                        handleClose();
                        onWidth(v);
                    } })))));
};
export default SelectWidth;
//# sourceMappingURL=SelectWidth.js.map