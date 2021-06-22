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
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Button, createMuiTheme } from '@material-ui/core';
import { toHTML, toMarkdown, toTex, ReferenceKind } from '@curvenote/schema';
import { Sidenote, AnchorBase } from 'sidenotes';
import { actions, Editor, EditorMenu, setup, Suggestions, Attributes, InlineActions, } from '../src';
import rootReducer from './reducers';
import middleware from './middleware';
import '../styles/index.scss';
import 'sidenotes/dist/sidenotes.css';
import snippet from './snippet';
import SuggestionSwitch from '../src/components/Suggestion/Switch';
import InlineActionSwitch from '../src/components/InlineActions/Switch';
var store = createStore(rootReducer, applyMiddleware.apply(void 0, middleware));
var theme = createMuiTheme({});
var stateKey = 'myEditor';
var viewId1 = 'view1';
var docId = 'docId';
var newComment = function () {
    store.dispatch(actions.addCommentToSelectedView('sidenote1'));
};
var removeComment = function () {
    store.dispatch(actions.removeComment(viewId1, 'sidenote1'));
};
var someLinks = [
    {
        kind: ReferenceKind.cite,
        uid: 'simpeg2015',
        label: 'simpeg',
        content: 'Cockett et al., 2015',
        title: 'SimPEG: An open source framework for simulation and gradient based parameter estimation in geophysical applications.',
    },
    {
        kind: ReferenceKind.link,
        uid: 'https://curvenote.com',
        label: null,
        content: 'Curvenote',
        title: 'Move ideas forward',
    },
];
var opts = {
    transformKeyToId: function (key) { return key; },
    uploadImage: function (file) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(file);
            return [2, new Promise(function (resolve) {
                    return setTimeout(function () { return resolve('https://curvenote.dev/images/logo.png'); }, 2000);
                })];
        });
    }); },
    addComment: function () {
        newComment();
        return true;
    },
    onDoubleClick: function (stateId, viewId) {
        console.log('Double click', stateId, viewId);
        return false;
    },
    getDocId: function () {
        return docId;
    },
    theme: theme,
    throttle: 0,
    citationPrompt: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, [
                    {
                        key: 'simpeg2015',
                        kind: ReferenceKind.cite,
                        text: 'Cockett et al, 2015',
                        label: 'simpeg',
                        title: '',
                    },
                ]];
        });
    }); },
    createLinkSearch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, ({ search: function () { return someLinks; } })];
    }); }); },
    nodeViews: {},
};
setup(store, opts);
window.store = store;
store.dispatch(actions.initEditorState('full', stateKey, true, snippet, 0));
store.subscribe(function () {
    var myst = document.getElementById('myst');
    var tex = document.getElementById('tex');
    var html = document.getElementById('html');
    var editor = store.getState().editor.state.editors[stateKey];
    if (myst) {
        myst.innerText = toMarkdown(editor.state.doc);
    }
    if (tex) {
        try {
            tex.innerText = toTex(editor.state.doc);
        }
        catch (error) {
            tex.innerText = 'There was an error :(';
        }
    }
    if (html) {
        html.innerText = toHTML(editor.state.doc, editor.state.schema, document);
    }
    console.log(editor.counts);
});
ReactDOM.render(React.createElement(Provider, { store: store },
    React.createElement(React.StrictMode, null,
        React.createElement(EditorMenu, { standAlone: true }),
        React.createElement(InlineActions, null,
            React.createElement(InlineActionSwitch, null)),
        React.createElement("article", { id: docId, className: "content centered" },
            React.createElement(AnchorBase, { anchor: "anchor" },
                React.createElement("div", { className: "selected" },
                    React.createElement(Editor, { stateKey: stateKey, viewId: viewId1 }))),
            React.createElement("div", { className: "sidenotes" },
                React.createElement(Sidenote, { sidenote: "sidenote1", base: "anchor" },
                    React.createElement("div", { style: { width: 280, height: 100, backgroundColor: 'green' } })),
                React.createElement(Sidenote, { sidenote: "sidenote2", base: "anchor" },
                    React.createElement("div", { style: { width: 280, height: 100, backgroundColor: 'red' } })))),
        React.createElement("div", { className: "centered" },
            React.createElement("p", null,
                "Select some text to create an inline comment (cmd-opt-m). See",
                React.createElement("a", { href: "https://curvenote.com" }, " curvenote.com "),
                "for full demo."),
            React.createElement(Button, { onClick: newComment }, "Comment"),
            React.createElement(Button, { onClick: removeComment }, "Remove")),
        React.createElement(Suggestions, null,
            React.createElement(SuggestionSwitch, null)),
        React.createElement(Attributes, null))), document.getElementById('root'));
//# sourceMappingURL=index.js.map