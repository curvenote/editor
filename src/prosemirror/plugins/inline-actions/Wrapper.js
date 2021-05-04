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
import { Popper, ThemeProvider, } from '@material-ui/core';
import Toolbar from './Toolbar';
import { opts, ref } from '../../../connect';
var Wrapper = (function (_super) {
    __extends(Wrapper, _super);
    function Wrapper(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            kind: null,
            open: false,
            edit: false,
            anchorEl: null,
            placement: 'bottom-start',
        };
        return _this;
    }
    Wrapper.prototype.render = function () {
        var view = this.props.view;
        var _a = this.state, open = _a.open, edit = _a.edit, kind = _a.kind, anchorEl = _a.anchorEl, placement = _a.placement;
        return (React.createElement(ThemeProvider, { theme: opts.theme },
            React.createElement(Provider, { store: ref.store() },
                React.createElement(Popper, { style: { zIndex: 1301 }, open: open, anchorEl: anchorEl, transition: true, placement: placement },
                    React.createElement(Toolbar, __assign({}, {
                        view: view, open: open, edit: edit, kind: kind,
                    }))))));
    };
    return Wrapper;
}(Component));
export default Wrapper;
//# sourceMappingURL=Wrapper.js.map