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
import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles, createStyles, Grid, Menu, } from '@material-ui/core';
import { schemas } from '@curvenote/schema';
import { findParentNode } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { updateNodeAttrs, wrapInHeading } from '../../store/actions';
import TextAction from './TextAction';
import { getEditorState } from '../../store/selectors';
import { newLabel } from './utils';
import MenuAction from '../Menu/Action';
import Keyboard from '../Keyboard';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        width: 'fit-content',
        fontSize: 20,
        flexWrap: 'nowrap',
    },
}); });
var ABOVE_MODALS = { zIndex: 1301 };
var HeadingActions = function (props) {
    var _a, _b, _c;
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var dispatch = useDispatch();
    var _d = useState(false), labelOpen = _d[0], setLabelOpen = _d[1];
    var state = useSelector(function (s) { var _a; return (_a = getEditorState(s, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var parent = (state === null || state === void 0 ? void 0 : state.selection) && findParentNode(function (n) { return n.type.name === schemas.nodeNames.heading; })(state === null || state === void 0 ? void 0 : state.selection);
    var node = (_a = parent === null || parent === void 0 ? void 0 : parent.node) !== null && _a !== void 0 ? _a : (state === null || state === void 0 ? void 0 : state.selection).node;
    var pos = (_b = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _b !== void 0 ? _b : (_c = state === null || state === void 0 ? void 0 : state.selection) === null || _c === void 0 ? void 0 : _c.from;
    useEffect(function () { return setLabelOpen(false); }, [node]);
    var _e = React.useState(null), anchorEl = _e[0], setAnchorEl = _e[1];
    var onOpen = useCallback(function (event) { return setAnchorEl(event.currentTarget); }, []);
    var onClose = useCallback(function () { return setAnchorEl(null); }, []);
    if (!node || pos == null)
        return null;
    var _f = node.attrs, numbered = _f.numbered, label = _f.label, level = _f.level;
    var onNumbered = function () { return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, (label === '' ? { numbered: !numbered, label: newLabel('sec') } : { numbered: !numbered }), false)); };
    var onLevel = function (l) { return function () {
        onClose();
        if (!(state === null || state === void 0 ? void 0 : state.schema))
            return;
        if (l === 0) {
            dispatch(wrapInHeading(state === null || state === void 0 ? void 0 : state.schema, 0));
            return;
        }
        dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { level: l }, false));
    }; };
    var onLabel = function (t) { return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, (t === '' ? { label: newLabel('sec') } : { label: t }), false)); };
    var validateId = function (t) { return __awaiter(void 0, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            if (t === '')
                return [2, true];
            r = /^([a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9])$/;
            return [2, r.test(t)];
        });
    }); };
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
    if (labelOpen) {
        return (React.createElement(TextAction, { text: label, onCancel: function () { return setLabelOpen(false); }, onSubmit: function (t) { onLabel(t); setLabelOpen(false); }, validate: validateId, help: "The ID must be at least two characters and start with a letter, it may have dashes inside." }));
    }
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "expand", onClick: onOpen, "aria-controls": "insert-menu", text: "Heading " + level }),
        React.createElement(Menu, { id: "insert-menu", anchorEl: anchorEl, open: Boolean(anchorEl), onClose: onClose, style: ABOVE_MODALS },
            React.createElement(MenuAction, { action: onLevel(0), selected: level === 0, title: "Paragraph" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-0" })),
            React.createElement(MenuAction, { action: onLevel(1), selected: level === 1, title: "Heading 1" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-1" })),
            React.createElement(MenuAction, { action: onLevel(2), selected: level === 2, title: "Heading 2" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-2" })),
            React.createElement(MenuAction, { action: onLevel(3), selected: level === 3, title: "Heading 3" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-3" })),
            React.createElement(MenuAction, { action: onLevel(4), selected: level === 4, title: "Heading 4" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-4" })),
            React.createElement(MenuAction, { action: onLevel(5), selected: level === 5, title: "Heading 5" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-5" })),
            React.createElement(MenuAction, { action: onLevel(6), selected: level === 6, title: "Heading 6" },
                React.createElement(Keyboard, { shortcut: "Mod-Alt-6" }))),
        React.createElement(MenuIcon, { kind: "label", active: Boolean(label), onClick: function () { return setLabelOpen(true); } }),
        React.createElement(MenuIcon, { kind: "numbered", active: numbered, onClick: onNumbered })));
};
export default HeadingActions;
//# sourceMappingURL=HeadingActions.js.map