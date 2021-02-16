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
import LinkToolbar from './LinkToolbar';
import { opts, ref } from '../../../connect';
var LinkEditor = (function (_super) {
    __extends(LinkEditor, _super);
    function LinkEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            viewId: '',
            open: false,
            edit: false,
            href: '',
            onEdit: null,
            onDelete: null,
        };
        return _this;
    }
    LinkEditor.prototype.render = function () {
        var _a = this.state, viewId = _a.viewId, open = _a.open, edit = _a.edit, href = _a.href, onEdit = _a.onEdit, onDelete = _a.onDelete;
        return (React.createElement(ThemeProvider, { theme: opts.theme },
            React.createElement(Provider, { store: ref.store() },
                React.createElement(LinkToolbar, __assign({}, {
                    viewId: viewId, open: open, edit: edit, href: href, onDelete: onDelete, onEdit: onEdit,
                })))));
    };
    return LinkEditor;
}(Component));
export default LinkEditor;
//# sourceMappingURL=LinkEditor.js.map