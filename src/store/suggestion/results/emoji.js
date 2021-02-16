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
import { getSuggestion } from '../selectors';
var options = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [
        {
            name: 's',
            weight: 0.4,
        },
        {
            name: 'o',
            weight: 0.3,
        },
        {
            name: 'n',
            weight: 0.3,
        },
    ],
};
var fuse = null;
function getFuse() {
    return __awaiter(this, void 0, void 0, function () {
        var emoji;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (fuse)
                        return [2, fuse];
                    return [4, import('./emoji.json')];
                case 1:
                    emoji = _a.sent();
                    fuse = new Fuse(emoji.emoji, options);
                    return [2, fuse];
            }
        });
    });
}
export var startingSuggestions = [{
        c: '👍', n: 'Thumbs Up', s: '+1', o: 'thumbsup',
    }, {
        c: '👎', n: 'Thumbs Down', s: '-1', o: 'thumbsdown',
    }, {
        c: '😀', n: 'Grinning Face', s: 'grinning', o: ' :D',
    }, {
        c: '❤️', n: 'Red Heart', s: 'heart', o: ' <3',
    }, {
        c: '🚀', n: 'Rocket', s: 'rocket', o: '',
    }, {
        c: '🎉', n: 'Party Popper', s: 'tada', o: '',
    }, {
        c: '👀', n: 'Eyes', s: 'eyes', o: '',
    }, {
        c: '😕', n: 'Confused Face', s: 'confused', o: '',
    }];
export function chooseSelection(result) {
    return function (dispatch, getState) {
        var _a = getSuggestion(getState()), view = _a.view, _b = _a.range, from = _b.from, to = _b.to;
        if (view == null)
            return false;
        var tr = view.state.tr;
        tr.insertText(result.c + " ", from, to);
        view.dispatch(tr);
        return true;
    };
}
export function filterResults(search, callback) {
    var _this = this;
    if (search === 'D') {
        callback(startingSuggestions.filter(function (e) { return e.n === 'Grinning Face'; }));
        return;
    }
    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        var results;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, getFuse()];
                case 1:
                    results = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.search(search);
                    callback(results === null || results === void 0 ? void 0 : results.map(function (result) { return result.item; }));
                    return [2];
            }
        });
    }); }, 1);
}
//# sourceMappingURL=emoji.js.map