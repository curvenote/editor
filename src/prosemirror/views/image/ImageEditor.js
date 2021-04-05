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
import ImageToolbar from './ImageToolbar';
import { opts, ref } from '../../../connect';
var ImageEditor = (function (_super) {
    __extends(ImageEditor, _super);
    function ImageEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            viewId: '',
            open: false,
            edit: false,
            src: '',
            alt: '',
            title: '',
            align: 'center',
            width: DEFAULT_IMAGE_WIDTH,
        };
        return _this;
    }
    ImageEditor.prototype.render = function () {
        var _a = this.props, onAlign = _a.onAlign, onWidth = _a.onWidth, onDelete = _a.onDelete;
        var _b = this.state, viewId = _b.viewId, open = _b.open, edit = _b.edit, src = _b.src, alt = _b.alt, title = _b.title, align = _b.align, width = _b.width;
        return (React.createElement(ThemeProvider, { theme: opts.theme },
            React.createElement(Provider, { store: ref.store() },
                React.createElement("div", { style: { textAlign: align, margin: '1.5em 0' } },
                    !(src === null || src === void 0 ? void 0 : src.startsWith('block:')) && (React.createElement("img", { src: src, alt: alt, title: title, width: width + "%", style: { outline: open ? '2px solid #8cf' : 'none' } })),
                    React.createElement(ImageToolbar, __assign({ open: open && edit }, {
                        viewId: viewId, align: align, width: width, onAlign: onAlign, onWidth: onWidth, onDelete: onDelete,
                    }))))));
    };
    return ImageEditor;
}(Component));
export default ImageEditor;
//# sourceMappingURL=ImageEditor.js.map