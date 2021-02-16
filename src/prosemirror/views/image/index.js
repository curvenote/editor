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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React from 'react';
import { render } from 'react-dom';
import { opts } from '../../../connect';
import ImageEditor from './ImageEditor';
import { updateNodeAttrsOnView } from '../../utils';
import { isEditable } from '../../plugins/editable';
var ImageView = (function () {
    function ImageView(node, view, getPos) {
        var _this = this;
        this.editor = null;
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('div');
        var viewId = this.view.dom.id;
        var _a = node.attrs, src = _a.src, alt = _a.alt, title = _a.title, align = _a.align, width = _a.width;
        this.currentSrc = src;
        var onAlign = function (value) { return (updateNodeAttrsOnView(_this.view, { node: _this.node, pos: _this.getPos() }, { align: value })); };
        var onWidth = function (value) { return (updateNodeAttrsOnView(_this.view, { node: _this.node, pos: _this.getPos() }, { width: value })); };
        var onDelete = function () {
            var tr = _this.view.state.tr.delete(_this.getPos(), _this.getPos() + 1);
            _this.view.dispatch(tr);
        };
        render(React.createElement(ImageEditor, __assign({}, { onAlign: onAlign, onWidth: onWidth, onDelete: onDelete }, { ref: function (r) { _this.editor = r; } })), this.dom, function () { return __awaiter(_this, void 0, void 0, function () {
            var url;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, opts.image.downloadUrl(src)];
                    case 1:
                        url = _b.sent();
                        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.setState({
                            viewId: viewId,
                            src: url,
                            alt: alt, title: title, align: align, width: width,
                        });
                        return [2];
                }
            });
        }); });
    }
    ImageView.prototype.selectNode = function () {
        var _a;
        var viewId = this.view.dom.id;
        var edit = isEditable(this.view.state);
        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.setState({ open: this.view.hasFocus(), edit: edit, viewId: viewId });
    };
    ImageView.prototype.deselectNode = function () {
        var _a;
        var edit = isEditable(this.view.state);
        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.setState({ open: false, edit: edit });
    };
    ImageView.prototype.update = function (node) {
        var _a;
        if (!node.sameMarkup(this.node))
            return false;
        this.node = node;
        var edit = isEditable(this.view.state);
        var _b = node.attrs, src = _b.src, align = _b.align, alt = _b.alt, title = _b.title, width = _b.width;
        if (src !== this.currentSrc) {
            console.log('Source change?');
        }
        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.setState({
            edit: edit, align: align, alt: alt, title: title, width: width,
        });
        return true;
    };
    ImageView.prototype.destroy = function () {
    };
    return ImageView;
}());
export default ImageView;
//# sourceMappingURL=index.js.map