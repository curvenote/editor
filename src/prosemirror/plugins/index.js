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
import { autocomplete } from 'prosemirror-autocomplete';
import { buildBasicKeymap, buildCommentKeymap, buildKeymap, captureTab } from '../keymap';
import inputrules from '../inputrules';
import { store } from '../../connect';
import { editablePlugin } from './editable';
import { handleSuggestion } from '../../store/suggestion/actions';
import commentsPlugin from './comments';
import { getImagePlaceholderPlugin } from './ImagePlaceholder';
import getPromptPlugin from './prompts';
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
function getTriggers(schema, mention) {
    if (mention === void 0) { mention = false; }
    var triggers = [
        {
            name: 'emoji',
            trigger: ':',
            cancelOnFirstSpace: true,
        },
        {
            name: 'command',
            trigger: '/',
            cancelOnFirstSpace: true,
        },
        {
            name: 'link',
            trigger: '[[',
            cancelOnFirstSpace: false,
        },
    ];
    if (mention)
        triggers.push({ name: 'mention', trigger: '@', cancelOnFirstSpace: false });
    if (schema.nodes.variable)
        triggers.push.apply(triggers, [
            {
                name: 'variable',
                trigger: /(?:^|\s|\n|[^\d\w])((?:^[a-zA-Z0-9_]+)\s?=)/,
                cancelOnFirstSpace: false,
            },
            {
                name: 'insert',
                trigger: '{{',
                cancelOnFirstSpace: false,
            },
        ]);
    return triggers;
}
export function getPlugins(schemaPreset, schema, stateKey, version, startEditable) {
    if (schemaPreset === 'comment') {
        return __spreadArray(__spreadArray(__spreadArray([
            editablePlugin(startEditable),
            keymap(buildCommentKeymap(stateKey, schema))
        ], autocomplete({
            triggers: getTriggers(schema, true),
            reducer: function (action) {
                return store.dispatch(handleSuggestion(action));
            },
        }), true), inputrules(schema), true), [
            keymap(baseKeymap),
            dropCursor(),
            gapCursor(),
            history(),
        ], false);
    }
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
        editablePlugin(startEditable),
        getPromptPlugin()
    ], autocomplete({
        triggers: getTriggers(schema, false),
        reducer: function (action) {
            return store.dispatch(handleSuggestion(action));
        },
    }), true), [
        getImagePlaceholderPlugin()
    ], false), inputrules(schema), true), [
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
    return __spreadArray(__spreadArray([
        editablePlugin(true),
        commentsPlugin()
    ], inputrules(schema), true), [
        keymap(buildBasicKeymap(schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
    ], false);
}
//# sourceMappingURL=index.js.map