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
import { Plugin, PluginKey } from 'prosemirror-state';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Decoration, DecorationSet } from 'prosemirror-view';
export var KEEP_SELECTION_ALIVE = 'KEEP_SELECTION_ALIVE';
var inactiveSuggestionState = {
    active: false, trigger: null, decorations: DecorationSet.empty, text: null, range: null,
};
export var key = new PluginKey('suggestion');
export function triggerSuggestion(view, trigger) {
    var plugin = key.get(view.state);
    var tr = view.state.tr
        .insertText(trigger)
        .scrollIntoView()
        .setMeta(plugin, { action: 'add', trigger: trigger });
    view.dispatch(tr);
}
export var SuggestionActionKind;
(function (SuggestionActionKind) {
    SuggestionActionKind["open"] = "open";
    SuggestionActionKind["close"] = "close";
    SuggestionActionKind["filter"] = "filter";
    SuggestionActionKind["previous"] = "previous";
    SuggestionActionKind["next"] = "next";
    SuggestionActionKind["select"] = "select";
})(SuggestionActionKind || (SuggestionActionKind = {}));
function actionFromEvent(event) {
    switch (event.key) {
        case 'ArrowUp': return SuggestionActionKind.previous;
        case 'ArrowDown': return SuggestionActionKind.next;
        case 'Tab': return SuggestionActionKind.select;
        case 'Enter': return SuggestionActionKind.select;
        case 'Escape': return SuggestionActionKind.close;
        default: return null;
    }
}
function inSuggestion(selection, decorations) {
    return decorations.find(selection.from, selection.to).length > 0;
}
export function cancelSuggestion(view) {
    var plugin = key.get(view.state);
    var tr = view.state.tr;
    tr.setMeta(plugin, { action: 'remove', trigger: null });
    view.dispatch(tr);
    return true;
}
function cancelIfInsideAndPass(view) {
    var plugin = key.get(view.state);
    var decorations = plugin.getState(view.state).decorations;
    if (inSuggestion(view.state.selection, decorations)) {
        cancelSuggestion(view);
    }
    return false;
}
export default function getPlugins(onAction, suggestionTrigger, cancelOnFirstSpace, suggestionClass, suggestionStyle) {
    if (onAction === void 0) { onAction = function () { return false; }; }
    if (suggestionTrigger === void 0) { suggestionTrigger = /(?:^|\W)(@|#)$/; }
    if (cancelOnFirstSpace === void 0) { cancelOnFirstSpace = true; }
    if (suggestionClass === void 0) { suggestionClass = 'suggestion'; }
    if (suggestionStyle === void 0) { suggestionStyle = 'background: rgba(0, 0, 255, 0.05); color: blue; padding: 5px; border-radius: 5px 5px 0 0;'; }
    var plugin = new Plugin({
        key: key,
        view: function () {
            return {
                update: function (view, prevState) {
                    var _a, _b, _c;
                    var prev = plugin.getState(prevState);
                    var next = plugin.getState(view.state);
                    var started = !prev.active && next.active;
                    var stopped = prev.active && !next.active;
                    var changed = next.active && !started && !stopped && prev.text !== next.text;
                    var action = {
                        view: view,
                        trigger: (_a = next.trigger) !== null && _a !== void 0 ? _a : prev.trigger,
                        search: (_b = next.text) !== null && _b !== void 0 ? _b : prev.text,
                        range: (_c = next.range) !== null && _c !== void 0 ? _c : prev.range,
                    };
                    if (started)
                        onAction(__assign(__assign({}, action), { kind: SuggestionActionKind.open }));
                    if (changed)
                        onAction(__assign(__assign({}, action), { kind: SuggestionActionKind.filter }));
                    if (stopped)
                        onAction(__assign(__assign({}, action), { kind: SuggestionActionKind.close }));
                },
            };
        },
        state: {
            init: function () { return (__assign({}, inactiveSuggestionState)); },
            apply: function (tr, state) {
                var _a;
                var meta = tr.getMeta(plugin);
                if ((meta === null || meta === void 0 ? void 0 : meta.action) === 'add') {
                    var from_1 = tr.selection.from - meta.trigger.length;
                    var to_1 = tr.selection.from;
                    var deco = Decoration.inline(from_1, to_1, {
                        class: suggestionClass,
                        style: suggestionStyle,
                    }, { inclusiveStart: false, inclusiveEnd: true });
                    return {
                        active: true,
                        trigger: meta.trigger,
                        decorations: DecorationSet.create(tr.doc, [deco]),
                        text: '',
                        range: { from: from_1, to: to_1 },
                    };
                }
                var active = state.active, trigger = state.trigger, decorations = state.decorations;
                var nextDecorations = decorations.map(tr.mapping, tr.doc);
                var hasDecoration = nextDecorations.find().length > 0;
                if ((meta === null || meta === void 0 ? void 0 : meta.action) === 'remove'
                    || !inSuggestion(tr.selection, nextDecorations)
                    || !hasDecoration)
                    return __assign({}, inactiveSuggestionState);
                var _b = nextDecorations.find()[0], from = _b.from, to = _b.to;
                var text = tr.doc.textBetween(from, to);
                if (!text.startsWith(trigger))
                    return __assign({}, inactiveSuggestionState);
                return {
                    active: active,
                    trigger: trigger,
                    decorations: nextDecorations,
                    text: text.slice((_a = trigger === null || trigger === void 0 ? void 0 : trigger.length) !== null && _a !== void 0 ? _a : 1),
                    range: { from: from, to: to },
                };
            },
        },
        props: {
            decorations: function (state) { return plugin.getState(state).decorations; },
            handlePaste: function (view) { return cancelIfInsideAndPass(view); },
            handleDrop: function (view) { return cancelIfInsideAndPass(view); },
            handleKeyDown: function (view, event) {
                var _a;
                var _b = plugin.getState(view.state), trigger = _b.trigger, active = _b.active, decorations = _b.decorations;
                if (!active || !inSuggestion(view.state.selection, decorations))
                    return false;
                var _c = decorations.find()[0], from = _c.from, to = _c.to;
                var text = view.state.doc.textBetween(from, to);
                var search = text.slice((_a = trigger === null || trigger === void 0 ? void 0 : trigger.length) !== null && _a !== void 0 ? _a : 1);
                var cancelOnSpace = typeof cancelOnFirstSpace === 'boolean' ? cancelOnFirstSpace : cancelOnFirstSpace(trigger);
                if (cancelOnSpace && search.length === 0 && (event.key === ' ' || event.key === 'Spacebar')) {
                    cancelSuggestion(view);
                    return false;
                }
                var kind = actionFromEvent(event);
                var action = {
                    view: view,
                    trigger: trigger,
                    search: search,
                    range: { from: from, to: to },
                };
                switch (kind) {
                    case SuggestionActionKind.close:
                        return cancelSuggestion(view);
                    case SuggestionActionKind.select: {
                        var result = onAction(__assign(__assign({}, action), { kind: SuggestionActionKind.select }));
                        if (result === KEEP_SELECTION_ALIVE) {
                            return true;
                        }
                        return result || cancelSuggestion(view);
                    }
                    case SuggestionActionKind.previous:
                        return Boolean(onAction(__assign(__assign({}, action), { kind: SuggestionActionKind.previous })));
                    case SuggestionActionKind.next:
                        return Boolean(onAction(__assign(__assign({}, action), { kind: SuggestionActionKind.next })));
                    default:
                        break;
                }
                return false;
            },
        },
    });
    var rules = [
        plugin,
        inputRules({
            rules: [
                new InputRule(suggestionTrigger, function (state, match) {
                    var decorations = plugin.getState(state).decorations;
                    if (inSuggestion(state.selection, decorations))
                        return null;
                    var tr = state.tr.insertText(match[1][match[1].length - 1]).scrollIntoView();
                    tr.setMeta(plugin, { action: 'add', trigger: match[1] });
                    return tr;
                }),
            ],
        }),
    ];
    return rules;
}
//# sourceMappingURL=suggestion.js.map