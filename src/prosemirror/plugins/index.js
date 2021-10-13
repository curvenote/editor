var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { collab } from 'prosemirror-collab';
import { columnResizing, tableEditing, goToNextCell } from 'prosemirror-tables';
import { nodeNames } from '@curvenote/schema';
import suggestion from './suggestion';
import { buildBasicKeymap, buildKeymap, captureTab } from '../keymap';
import inputrules from '../inputrules';
import { store } from '../../connect';
import { editablePlugin } from './editable';
import { handleSuggestion } from '../../store/suggestion/actions';
import commentsPlugin from './comments';
import { getImagePlaceholderPlugin } from './ImagePlaceholder';
import getPromptPlugin from './prompts';
var ALL_TRIGGERS = /(?:^|\s|\n|[^\d\w])(:|\/|(?:(?:^[a-zA-Z0-9_]+)\s?=)|(?:\{\{)|(?:\[\[))$/;
var NO_VARIABLE = /(?:^|\s|\n|[^\d\w])(:|\/|(?:\{\{)|(?:\[\[))$/;
function tablesPlugins(schema) {
    if (!schema.nodes[nodeNames.table])
        return [];
    return [
        columnResizing({}),
        tableEditing(),
        keymap({
            Tab: goToNextCell(1),
            'Shift-Tab': goToNextCell(-1),
        }),
    ];
}
export function getPlugins(schema, stateKey, version, startEditable) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([
        editablePlugin(startEditable)
    ], suggestion(function (action) { return store.dispatch(handleSuggestion(action)); }, schema.nodes.variable ? ALL_TRIGGERS : NO_VARIABLE, function (trigger) { return !(trigger === null || trigger === void 0 ? void 0 : trigger.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/)); }), true), [
        commentsPlugin(),
        getPromptPlugin(),
        getImagePlaceholderPlugin(),
        inputrules(schema),
        keymap(buildKeymap(stateKey, schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        collab({ version: version })
    ], false), tablesPlugins(schema), true), [
        history(),
        keymap(captureTab()),
    ], false);
}
export function getInlinePlugins(schema) {
    return [
        editablePlugin(true),
        commentsPlugin(),
        inputrules(schema),
        keymap(buildBasicKeymap(schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
    ];
}
//# sourceMappingURL=index.js.map