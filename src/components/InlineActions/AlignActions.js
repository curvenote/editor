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
import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { deleteNode, updateNodeAttrs } from '../../store/actions';
import SelectWidth from './SelectWidth';
import TextAction from './TextAction';
import { newLabel, positionPopper } from './utils';
import { getEditorState } from '../../store/selectors';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        width: 'fit-content',
        fontSize: 20,
        flexWrap: 'nowrap',
    },
}); });
var AlignActions = function (props) {
    var _a;
    var stateId = props.stateId, viewId = props.viewId, anchorEl = props.anchorEl, showCaption = props.showCaption;
    var dispatch = useDispatch();
    var classes = useStyles();
    var _b = useState(false), labelOpen = _b[0], setLabelOpen = _b[1];
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    var _c = (_a = selection) !== null && _a !== void 0 ? _a : {}, node = _c.node, pos = _c.from;
    useEffect(function () { return setLabelOpen(false); }, [node]);
    if (!node || !selection || !isNodeSelection(selection))
        return null;
    var _d = node === null || node === void 0 ? void 0 : node.attrs, align = _d.align, width = _d.width, numbered = _d.numbered, caption = _d.caption, label = _d.label;
    var onAlign = function (a) { return function () {
        dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { align: a }));
    }; };
    var onWidth = function (value) {
        dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { width: value }));
    };
    var onNumbered = function () { return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, (label === '' ? { numbered: !numbered, label: newLabel('fig') } : { numbered: !numbered }))); };
    var onCaption = function () { return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, (label === '' && !caption ? { caption: !caption, label: newLabel('fig') } : { caption: !caption }))); };
    var onLabel = function (t) { return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, (t === '' ? { label: newLabel('fig') } : { label: t }))); };
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, { node: node, pos: pos })); };
    var validateId = function (t) { return __awaiter(void 0, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            if (t === '')
                return [2, true];
            r = /^([a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9])$/;
            return [2, r.test(t)];
        });
    }); };
    positionPopper(anchorEl);
    if (labelOpen) {
        return (React.createElement(TextAction, { text: label, onCancel: function () { return setLabelOpen(false); }, onSubmit: function (t) { onLabel(t); setLabelOpen(false); }, validate: validateId, help: "The ID must be at least two characters and start with a letter, it may have dashes inside." }));
    }
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "left", active: align === 'left', onClick: onAlign('left') }),
        React.createElement(MenuIcon, { kind: "center", active: align === 'center', onClick: onAlign('center') }),
        React.createElement(MenuIcon, { kind: "right", active: align === 'right', onClick: onAlign('right') }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(SelectWidth, { width: width, onWidth: onWidth }),
        showCaption && (React.createElement(React.Fragment, null,
            React.createElement(MenuIcon, { kind: "divider" }),
            React.createElement(MenuIcon, { kind: "caption", active: caption, onClick: onCaption }),
            caption && (React.createElement(React.Fragment, null,
                React.createElement(MenuIcon, { kind: "label", active: Boolean(label), onClick: function () { return setLabelOpen(true); } }),
                React.createElement(MenuIcon, { kind: "numbered", active: numbered, onClick: onNumbered }))))),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
};
AlignActions.defaultProps = {
    showCaption: false,
};
export default AlignActions;
//# sourceMappingURL=AlignActions.js.map