var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { collab } from 'prosemirror-collab';
import suggestion from './suggestion';
import { buildKeymap } from '../keymap';
import inputrules from '../inputrules';
import { store } from '../../connect';
import { editablePlugin } from './editable';
import { handleSuggestion } from '../../store/suggestion/actions';
import inlineActionsPlugin from './inline-actions';
import commentsPlugin from './comments';
import { getImagePlaceholderPlugin } from './ImagePlaceholder';
var ALL_TRIGGERS = /(?:^|\s|\n)(:|\/|(?:(?:^[a-zA-Z0-9_]+)\s?=)|(?:\{\{)|(?:\[\[))$/;
var NO_VARIABLE = /(?:^|\s|\n)(:|\/|(?:\{\{)|(?:\[\[))$/;
export function getPlugins(schema, stateKey, version, startEditable) {
    return __spreadArrays([
        editablePlugin(startEditable)
    ], suggestion(function (action) { return store.dispatch(handleSuggestion(action)); }, schema.nodes.variable ? ALL_TRIGGERS : NO_VARIABLE, function (trigger) { return !(trigger === null || trigger === void 0 ? void 0 : trigger.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/)); }), [
        commentsPlugin(),
        inlineActionsPlugin,
        getImagePlaceholderPlugin(),
        inputrules(schema),
        keymap(buildKeymap(stateKey, schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        collab({ version: version }),
        history(),
    ]);
}
//# sourceMappingURL=index.js.map