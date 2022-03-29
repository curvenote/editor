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
import { ReferenceKind } from '@curvenote/schema';
import { selectSuggestionState } from '../selectors';
import { opts } from '../../../connect';
import { insertInlineNode } from '../../actions/editor';
var context = null;
export var startingSuggestions = function (search, create) {
    if (create === void 0) { create = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var getContextPromise;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!create) return [3, 2];
                    getContextPromise = opts.createLinkSearch().then(function (c) {
                        context = c;
                    });
                    if (!!context) return [3, 2];
                    return [4, getContextPromise];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: return [2, (_a = context === null || context === void 0 ? void 0 : context.search(search)) !== null && _a !== void 0 ? _a : []];
            }
        });
    });
};
export function setSearchContext(searchContext) {
    context = searchContext;
}
export function chooseSelection(result) {
    return function (dispatch, getState) {
        var _a, _b, _c, _d;
        var _e = selectSuggestionState(getState()), view = _e.view, _f = _e.range, from = _f.from, to = _f.to;
        if (view == null)
            return false;
        view.dispatch(view.state.tr.insertText('', from, to));
        switch (result.kind) {
            case ReferenceKind.link: {
                var tr = view.state.tr;
                var text = result.content;
                tr.insertText("".concat(text, " "), from);
                var mark = view.state.schema.marks.link.create({
                    href: result.uid,
                    title: (_a = result.title) !== null && _a !== void 0 ? _a : '',
                    kind: (_b = result.linkKind) !== null && _b !== void 0 ? _b : '',
                });
                view.dispatch(tr.addMark(from, from + text.length, mark));
                return true;
            }
            default: {
                var text = ReferenceKind.cite === result.kind ? result.content : '';
                var citeAttrs = {
                    key: result.uid,
                    title: (_c = result.title) !== null && _c !== void 0 ? _c : '',
                    label: (_d = result.label) !== null && _d !== void 0 ? _d : null,
                    kind: result.kind,
                    text: text,
                };
                return dispatch(insertInlineNode(view.state.schema.nodes.cite, citeAttrs));
            }
        }
    };
}
export function filterResults(schema, search, callback) {
    var _this = this;
    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        var results;
        var _a;
        return __generator(this, function (_b) {
            results = (_a = context === null || context === void 0 ? void 0 : context.search(search)) !== null && _a !== void 0 ? _a : [];
            callback(results);
            return [2];
        });
    }); }, 1);
}
//# sourceMappingURL=link.js.map