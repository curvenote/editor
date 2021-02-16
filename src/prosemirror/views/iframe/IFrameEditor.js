var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { DEFAULT_IMAGE_WIDTH } from '@curvenote/schema';
import ImageToolbar from './IFrameToolbar';
import { opts, ref } from '../../../connect';
var IFrameEditor = (function (_super) {
    __extends(IFrameEditor, _super);
    function IFrameEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            viewId: '',
            open: false,
            edit: false,
            src: '',
            align: 'center',
            width: DEFAULT_IMAGE_WIDTH,
        };
        return _this;
    }
    IFrameEditor.prototype.render = function () {
        var _a = this.props, onAlign = _a.onAlign, onWidth = _a.onWidth, onDelete = _a.onDelete;
        var _b = this.state, viewId = _b.viewId, open = _b.open, edit = _b.edit, src = _b.src, align = _b.align, width = _b.width;
        return (React.createElement(ThemeProvider, { theme: opts.theme },
            React.createElement(Provider, { store: ref.store() },
                React.createElement("div", { style: { margin: '1.5em 0' } },
                    React.createElement("div", { style: {
                            position: 'relative',
                            paddingBottom: Math.round((9 / 16) * width) + "%",
                            width: width + "%",
                            marginLeft: align === 'left' ? '' : 'auto',
                            marginRight: align === 'right' ? '' : 'auto',
                        } },
                        React.createElement("iframe", { title: src, style: {
                                width: '100%', height: '100%', position: 'absolute', left: 0, top: 0,
                            }, frameBorder: "0", width: "100%", height: "100%", src: src, allowFullScreen: true, allow: "autoplay" })),
                    React.createElement(ImageToolbar, __assign({ open: open && edit }, {
                        viewId: viewId, align: align, width: width, onAlign: onAlign, onWidth: onWidth, onDelete: onDelete,
                    }))))));
    };
    return IFrameEditor;
}(Component));
export default IFrameEditor;
//# sourceMappingURL=IFrameEditor.js.map