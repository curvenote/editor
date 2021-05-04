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
import Fuse from 'fuse.js';
import { Fragment } from 'prosemirror-model';
import { getSuggestion } from '../selectors';
import * as actions from '../../actions/editor';
import { commands, CommandNames } from '../commands';
import { triggerSuggestion } from '../../../prosemirror/plugins/suggestion';
import { getLinkBoundsIfTheyExist } from '../../actions/utils';
import { getEditorView } from '../../state/selectors';
import { getYouTubeId, getMiroId, getLoomId, getVimeoId, } from './utils';
import { opts } from '../../../connect';
var options = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [
        {
            name: 'title',
            weight: 0.6,
        },
        {
            name: 'shortcut',
            weight: 0.2,
        },
        {
            name: 'description',
            weight: 0.2,
        },
    ],
};
var fuse = new Fuse(commands, options);
var filterCommands = function (schema, results) {
    var allowedNodes = new Set(Object.keys(schema.nodes));
    var filtered = results.filter(function (r) {
        if (r.node == null)
            return true;
        return allowedNodes.has(r.node);
    });
    return filtered;
};
export var startingSuggestions = function (schema) { return filterCommands(schema, commands); };
export function executeCommand(command, viewOrId, removeText, replace) {
    var _this = this;
    if (removeText === void 0) { removeText = function () { return true; }; }
    if (replace === void 0) { replace = false; }
    return function (dispatch, getState) { return __awaiter(_this, void 0, void 0, function () {
        var view, ev, schema, replaceOrInsert, _a, linkBounds, from_1, to_1, href, _b, from, to, name_1, name_2, name_3, url, id, src, url, id, src, url, id, src, url, id, src, src, keys, nodes, wrapped, tr;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (viewOrId == null)
                        return [2, false];
                    if (typeof viewOrId === 'string') {
                        ev = getEditorView(getState(), viewOrId);
                        if (ev.view == null)
                            return [2, false];
                        view = ev.view;
                    }
                    else {
                        view = viewOrId;
                    }
                    schema = view.state.schema;
                    replaceOrInsert = replace ? actions.replaceSelection : actions.insertNode;
                    _a = command;
                    switch (_a) {
                        case CommandNames.link: return [3, 1];
                        case CommandNames.callout: return [3, 2];
                        case CommandNames.aside: return [3, 3];
                        case CommandNames.horizontal_rule: return [3, 4];
                        case CommandNames.paragraph: return [3, 5];
                        case CommandNames.heading1: return [3, 6];
                        case CommandNames.heading2: return [3, 6];
                        case CommandNames.heading3: return [3, 6];
                        case CommandNames.heading4: return [3, 6];
                        case CommandNames.heading5: return [3, 6];
                        case CommandNames.heading6: return [3, 6];
                        case CommandNames.quote: return [3, 7];
                        case CommandNames.bullet_list: return [3, 8];
                        case CommandNames.ordered_list: return [3, 9];
                        case CommandNames.emoji: return [3, 10];
                        case CommandNames.math: return [3, 11];
                        case CommandNames.equation: return [3, 12];
                        case CommandNames.code: return [3, 13];
                        case CommandNames.variable: return [3, 14];
                        case CommandNames.display: return [3, 15];
                        case CommandNames.range: return [3, 16];
                        case CommandNames.dynamic: return [3, 17];
                        case CommandNames.switch: return [3, 18];
                        case CommandNames.button: return [3, 19];
                        case CommandNames.youtube: return [3, 20];
                        case CommandNames.loom: return [3, 21];
                        case CommandNames.vimeo: return [3, 22];
                        case CommandNames.miro: return [3, 23];
                        case CommandNames.iframe: return [3, 24];
                        case CommandNames.citation: return [3, 25];
                    }
                    return [3, 27];
                case 1:
                    {
                        removeText();
                        linkBounds = getLinkBoundsIfTheyExist(view.state);
                        if (linkBounds) {
                            from_1 = linkBounds.from, to_1 = linkBounds.to;
                            view.dispatch(view.state.tr.removeMark(from_1, to_1, schema.marks.link));
                            return [2, true];
                        }
                        href = prompt('Link Url?');
                        if (!href)
                            return [2, false];
                        _b = view.state.selection, from = _b.from, to = _b.to;
                        view.dispatch(view.state.tr.addMark(from, to, schema.marks.link.create({ href: href })));
                        return [2, true];
                    }
                    _f.label = 2;
                case 2:
                    removeText();
                    dispatch(actions.wrapIn(schema.nodes.callout));
                    return [2, true];
                case 3:
                    removeText();
                    dispatch(actions.wrapIn(schema.nodes.aside));
                    return [2, true];
                case 4:
                    removeText();
                    dispatch(replaceOrInsert(schema.nodes.horizontal_rule));
                    return [2, true];
                case 5:
                    removeText();
                    dispatch(actions.wrapInHeading(schema, 0));
                    return [2, true];
                case 6:
                    removeText();
                    dispatch(actions.wrapInHeading(schema, Number.parseInt(command.slice(7), 10)));
                    return [2, true];
                case 7:
                    removeText();
                    dispatch(actions.wrapIn(schema.nodes.blockquote));
                    return [2, true];
                case 8:
                    removeText();
                    dispatch(actions.wrapIn(schema.nodes.bullet_list));
                    return [2, true];
                case 9:
                    removeText();
                    dispatch(actions.wrapIn(schema.nodes.ordered_list));
                    return [2, true];
                case 10:
                    removeText();
                    triggerSuggestion(view, ':');
                    return [2, true];
                case 11:
                    removeText();
                    dispatch(actions.insertNode(schema.nodes.math));
                    return [2, true];
                case 12:
                    removeText();
                    dispatch(replaceOrInsert(schema.nodes.equation));
                    return [2, true];
                case 13:
                    removeText();
                    dispatch(replaceOrInsert(schema.nodes.code_block));
                    return [2, true];
                case 14:
                    removeText();
                    dispatch(actions.insertVariable(schema, { name: 'myVar', value: '0', valueFunction: '' }));
                    return [2, true];
                case 15:
                    removeText();
                    triggerSuggestion(view, '{{');
                    return [2, true];
                case 16:
                    {
                        removeText();
                        name_1 = (_c = prompt('Name of the variable:')) !== null && _c !== void 0 ? _c : 'myVar';
                        dispatch(actions.insertInlineNode(schema.nodes.range, { valueFunction: name_1, changeFunction: "{" + name_1 + ": value}" }));
                        return [2, true];
                    }
                    _f.label = 17;
                case 17:
                    {
                        removeText();
                        name_2 = (_d = prompt('Name of the variable:')) !== null && _d !== void 0 ? _d : 'myVar';
                        dispatch(actions.insertInlineNode(schema.nodes.dynamic, { valueFunction: name_2, changeFunction: "{" + name_2 + ": value}" }));
                        return [2, true];
                    }
                    _f.label = 18;
                case 18:
                    {
                        removeText();
                        name_3 = (_e = prompt('Name of the variable:')) !== null && _e !== void 0 ? _e : 'myVar';
                        dispatch(actions.insertInlineNode(schema.nodes.switch, { valueFunction: name_3, changeFunction: "{" + name_3 + ": value}" }));
                        return [2, true];
                    }
                    _f.label = 19;
                case 19:
                    {
                        removeText();
                        dispatch(actions.insertInlineNode(schema.nodes.button, { clickFunction: '' }));
                        return [2, true];
                    }
                    _f.label = 20;
                case 20:
                    {
                        removeText();
                        url = prompt('Link to the YouTube video:');
                        if (!url)
                            return [2, true];
                        id = getYouTubeId(url);
                        src = "https://www.youtube-nocookie.com/embed/" + id;
                        dispatch(actions.insertNode(schema.nodes.iframe, { src: src }));
                        return [2, true];
                    }
                    _f.label = 21;
                case 21:
                    {
                        removeText();
                        url = prompt('Link to the Loom Video:');
                        if (!url)
                            return [2, true];
                        id = getLoomId(url);
                        src = "https://www.loom.com/embed/" + id;
                        dispatch(actions.insertNode(schema.nodes.iframe, { src: src }));
                        return [2, true];
                    }
                    _f.label = 22;
                case 22:
                    {
                        removeText();
                        url = prompt('Link to the Vimeo Video:');
                        if (!url)
                            return [2, true];
                        id = getVimeoId(url);
                        src = "https://player.vimeo.com/video/" + id;
                        dispatch(actions.insertNode(schema.nodes.iframe, { src: src }));
                        return [2, true];
                    }
                    _f.label = 23;
                case 23:
                    {
                        removeText();
                        url = prompt('Link to the Miro Board:');
                        if (!url)
                            return [2, true];
                        id = getMiroId(url);
                        src = "https://miro.com/app/live-embed/" + id;
                        dispatch(actions.insertNode(schema.nodes.iframe, { src: src }));
                        return [2, true];
                    }
                    _f.label = 24;
                case 24:
                    {
                        removeText();
                        src = prompt('Link to the IFrame:');
                        if (!src)
                            return [2, true];
                        dispatch(actions.insertNode(schema.nodes.iframe, { src: src }));
                        return [2, true];
                    }
                    _f.label = 25;
                case 25:
                    removeText();
                    return [4, opts.citationPrompt()];
                case 26:
                    keys = _f.sent();
                    if (!keys || keys.length === 0)
                        return [2, true];
                    nodes = keys.map(function (k) { return schema.nodes.cite.create({ key: k }); });
                    wrapped = schema.nodes.cite_group.createAndFill({}, Fragment.from(nodes));
                    if (!wrapped)
                        return [2, false];
                    tr = view.state.tr.replaceSelectionWith(wrapped).scrollIntoView();
                    view.dispatch(tr);
                    return [2, true];
                case 27: return [2, removeText()];
            }
        });
    }); };
}
export function chooseSelection(result) {
    var _this = this;
    return function (dispatch, getState) { return __awaiter(_this, void 0, void 0, function () {
        var _a, view, _b, from, to, removeText;
        return __generator(this, function (_c) {
            _a = getSuggestion(getState()), view = _a.view, _b = _a.range, from = _b.from, to = _b.to;
            if (view == null)
                return [2, false];
            removeText = function () {
                var tr = view.state.tr;
                tr.insertText('', from, to);
                view.dispatch(tr);
                return true;
            };
            return [2, dispatch(executeCommand(result.name, view, removeText, true))];
        });
    }); };
}
export function filterResults(schema, search, callback) {
    setTimeout(function () {
        var results = fuse.search(search);
        callback(filterCommands(schema, results.map(function (result) { return result.item; })));
    }, 1);
}
//# sourceMappingURL=command.js.map