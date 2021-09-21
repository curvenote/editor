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
import { SuggestionKind, UPDATE_SUGGESTION, UPDATE_RESULTS, SELECT_SUGGESTION, variableTrigger, } from './types';
import { getSuggestion } from './selectors';
import * as emoji from './results/emoji';
import * as command from './results/command';
import * as variable from './results/variable';
import * as link from './results/link';
export { executeCommand } from './results/command';
function positiveModulus(n, m) {
    return ((n % m) + m) % m;
}
function triggerToKind(trigger) {
    var _a;
    switch (trigger) {
        case ':':
            return SuggestionKind.emoji;
        case '/':
            return SuggestionKind.command;
        case '@':
            return SuggestionKind.person;
        case '[[':
            return SuggestionKind.link;
        case '{{':
            return SuggestionKind.display;
        case ((_a = trigger.match(variableTrigger)) !== null && _a !== void 0 ? _a : {}).input:
            return SuggestionKind.variable;
        default:
            throw new Error('Unknown trigger.');
    }
}
export function updateSuggestion(open, kind, search, view, range, trigger) {
    return {
        type: UPDATE_SUGGESTION,
        payload: {
            open: open,
            kind: kind,
            search: search,
            view: view,
            range: range,
            trigger: trigger,
        },
    };
}
export function closeSuggestion() {
    return {
        type: UPDATE_SUGGESTION,
        payload: {
            open: false,
        },
    };
}
export function updateResults(results) {
    return {
        type: UPDATE_RESULTS,
        payload: {
            results: results,
        },
    };
}
export function selectSuggestion(selection) {
    return {
        type: SELECT_SUGGESTION,
        payload: {
            selection: selection,
        },
    };
}
export function chooseSelection(selected) {
    return function (dispatch, getState) {
        var _a = getSuggestion(getState()), kind = _a.kind, results = _a.results;
        var result = results[selected];
        if (result == null)
            return false;
        switch (kind) {
            case SuggestionKind.emoji:
                return dispatch(emoji.chooseSelection(result));
            case SuggestionKind.command:
                dispatch(command.chooseSelection(result));
                return true;
            case SuggestionKind.link:
                dispatch(link.chooseSelection(result));
                return true;
            case SuggestionKind.variable:
            case SuggestionKind.display:
                return dispatch(variable.chooseSelection(kind, result));
            default:
                throw new Error('Unknown suggestion kind.');
        }
    };
}
export function filterResults(view, search) {
    return function (dispatch, getState) {
        var kind = getSuggestion(getState()).kind;
        switch (kind) {
            case SuggestionKind.emoji:
                return emoji.filterResults(view.state.schema, search, function (results) {
                    return dispatch(updateResults(results));
                });
            case SuggestionKind.command:
                return command.filterResults(view, search, function (results) {
                    return dispatch(updateResults(results));
                });
            case SuggestionKind.link:
                return link.filterResults(view.state.schema, search, function (results) {
                    return dispatch(updateResults(results));
                });
            case SuggestionKind.variable:
            case SuggestionKind.display:
                return variable.filterResults(kind, view.state.schema, search, dispatch, getState, function (results) { return dispatch(updateResults(results)); });
            default:
                throw new Error('Unknown suggestion kind.');
        }
    };
}
function setStartingSuggestions(view, kind, search, create) {
    var _this = this;
    if (create === void 0) { create = true; }
    return function (dispatch, getState) { return __awaiter(_this, void 0, void 0, function () {
        var _a, starting, suggestions, suggestions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = kind;
                    switch (_a) {
                        case SuggestionKind.emoji: return [3, 1];
                        case SuggestionKind.command: return [3, 2];
                        case SuggestionKind.link: return [3, 3];
                        case SuggestionKind.variable: return [3, 5];
                        case SuggestionKind.display: return [3, 5];
                    }
                    return [3, 6];
                case 1:
                    {
                        dispatch(updateResults(emoji.startingSuggestions));
                        return [2];
                    }
                    _b.label = 2;
                case 2:
                    {
                        starting = command.startingSuggestions(view);
                        dispatch(updateResults(starting));
                        return [2];
                    }
                    _b.label = 3;
                case 3:
                    dispatch(updateResults([]));
                    return [4, link.startingSuggestions(search, create)];
                case 4:
                    suggestions = _b.sent();
                    dispatch(updateResults(suggestions));
                    return [2];
                case 5:
                    {
                        suggestions = variable.startingSuggestions(kind, getState);
                        dispatch(updateResults(suggestions));
                        return [2];
                    }
                    _b.label = 6;
                case 6: throw new Error('Unknown suggestion kind.');
            }
        });
    }); };
}
export function handleSuggestion(action) {
    return function (dispatch, getState) {
        var _a;
        var kind = triggerToKind(action.trigger);
        dispatch(updateSuggestion(action.kind !== 'close', kind, action.search, action.view, action.range, action.trigger));
        if (action.kind === 'open') {
            dispatch(setStartingSuggestions(action.view, kind, (_a = action.search) !== null && _a !== void 0 ? _a : '', true));
            dispatch(selectSuggestion(0));
        }
        if (action.kind === 'previous' || action.kind === 'next') {
            var _b = getSuggestion(getState()), results = _b.results, selected = _b.selected;
            dispatch(selectSuggestion(positiveModulus(selected + (action.kind === 'previous' ? -1 : +1), results.length)));
            return true;
        }
        if (action.kind === 'filter') {
            if (action.search === '' || action.search == null) {
                dispatch(setStartingSuggestions(action.view, kind, '', false));
            }
            else {
                dispatch(filterResults(action.view, action.search));
            }
        }
        if (action.kind === 'select') {
            var selected = getSuggestion(getState()).selected;
            return dispatch(chooseSelection(selected));
        }
        return false;
    };
}
//# sourceMappingURL=actions.js.map