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
import { opts, ref } from '../../../connect';
import PreviewPopup from './PreviewPopup';
var PreviewEditor = (function (_super) {
    __extends(PreviewEditor, _super);
    function PreviewEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            viewId: '',
            uid: '',
            open: false,
            edit: false,
        };
        return _this;
    }
    PreviewEditor.prototype.render = function () {
        var _a = this.state, viewId = _a.viewId, open = _a.open, edit = _a.edit, uid = _a.uid;
        return (React.createElement(ThemeProvider, { theme: opts.theme },
            React.createElement(Provider, { store: ref.store() },
                React.createElement(PreviewPopup, __assign({}, {
                    viewId: viewId, uid: uid, edit: edit, open: open,
                })))));
    };
    return PreviewEditor;
}(Component));
export default PreviewEditor;
//# sourceMappingURL=PreviewEditor.js.map