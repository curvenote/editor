import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { collab } from 'prosemirror-collab';
import { Schema } from 'prosemirror-model';
import { columnResizing, tableEditing, goToNextCell } from 'prosemirror-tables';
import { nodeNames, schemas } from '@curvenote/schema';
import { Plugin } from 'prosemirror-state';
import { autocomplete, Trigger } from 'prosemirror-autocomplete';
import { buildBasicKeymap, buildCommentKeymap, buildKeymap, captureTab } from '../keymap';

import inputrules from '../inputrules';
import { store } from '../../connect';
import { editablePlugin } from './editable';
import { handleSuggestion } from '../../store/suggestion/actions';
import commentsPlugin from './comments';
import { createSelectPlugin } from './selection';
import { getImagePlaceholderPlugin } from './ImagePlaceholder';
import getPromptPlugin from './prompts';

function tablesPlugins(schema: Schema) {
  // Don't add plugins if they are not in the schema
  if (!schema.nodes[nodeNames.table]) return [];
  return [
    columnResizing({}),
    tableEditing(),
    keymap({
      Tab: goToNextCell(1),
      'Shift-Tab': goToNextCell(-1),
    }),
  ];
}

function getTriggers(schema: Schema, mention = false): Trigger[] {
  const triggers: Trigger[] = [
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
  if (mention) triggers.push({ name: 'mention', trigger: '@', cancelOnFirstSpace: false });
  if (schema.nodes.variable)
    triggers.push(
      ...[
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
      ],
    );
  return triggers;
}

export function getPlugins(
  schemaPreset: schemas.UseSchema,
  schema: Schema,
  stateKey: any,
  version: number,
  startEditable: boolean,
): Plugin[] {
  if (schemaPreset === 'comment') {
    return [
      editablePlugin(startEditable),
      keymap(buildCommentKeymap(stateKey, schema)),
      ...autocomplete({
        triggers: getTriggers(schema, true),
        reducer(action) {
          return store.dispatch(handleSuggestion(action));
        },
      }),
      ...inputrules(schema),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      history(),
    ];
  }
  return [
    editablePlugin(startEditable),
    getPromptPlugin(),
    ...autocomplete({
      triggers: getTriggers(schema, false),
      reducer(action) {
        return store.dispatch(handleSuggestion(action));
      },
    }),
    getImagePlaceholderPlugin(),
    ...inputrules(schema),
    keymap(buildKeymap(stateKey, schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    collab({ version }),
    ...tablesPlugins(schema), // put this plugin near the end of the array of plugins, since it handles mouse and arrow key events in tables rather broadly
    history(),
    keymap(captureTab()),
    createSelectPlugin(stateKey),
  ];
}

export function getInlinePlugins(schema: Schema): Plugin[] {
  return [
    editablePlugin(true),
    commentsPlugin(),
    ...inputrules(schema),
    keymap(buildBasicKeymap(schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
  ];
}
