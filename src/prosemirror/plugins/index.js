var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
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
import commentsPlugin from './comments';
import { getImagePlaceholderPlugin } from './ImagePlaceholder';
var ALL_TRIGGERS = /(?:^|\s|\n|[^\d\w])(:|\/|(?:(?:^[a-zA-Z0-9_]+)\s?=)|(?:\{\{)|(?:\[\[))$/;
var NO_VARIABLE = /(?:^|\s|\n|[^\d\w])(:|\/|(?:\{\{)|(?:\[\[))$/;
export function getPlugins(schema, stateKey, version, startEditable) {
    return __spreadArray(__spreadArray([
        editablePlugin(startEditable)
    ], suggestion(function (action) { return store.dispatch(handleSuggestion(action)); }, schema.nodes.variable ? ALL_TRIGGERS : NO_VARIABLE, function (trigger) { return !(trigger === null || trigger === void 0 ? void 0 : trigger.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/)); })), [
        commentsPlugin(),
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