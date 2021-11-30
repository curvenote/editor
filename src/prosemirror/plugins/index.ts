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
import suggestion from './suggestion';
import { buildBasicKeymap, buildKeymap, captureTab } from '../keymap';
import inputrules from '../inputrules';
import { store } from '../../connect';
import { editablePlugin } from './editable';
import { handleSuggestion } from '../../store/suggestion/actions';
import getCommentsPlugin from './comments';
import { getImagePlaceholderPlugin } from './ImagePlaceholder';
import getPromptPlugin from './prompts';

const ALL_TRIGGERS = /(?:^|\s|\n|[^\d\w])(:|\/|(?:(?:^[a-zA-Z0-9_]+)\s?=)|(?:\{\{)|(?:\[\[))$/;
const NO_VARIABLE = /(?:^|\s|\n|[^\d\w])(:|\/|(?:\{\{)|(?:\[\[))$/;

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

function commentPlugins(preset: schemas.UseSchema): Plugin[] {
  return preset !== 'comment' ? [getCommentsPlugin()] : [];
}

export function getPlugins(
  schemaPreset: schemas.UseSchema,
  schema: Schema,
  stateKey: any,
  version: number,
  startEditable: boolean,
): Plugin[] {
  return [
    editablePlugin(startEditable),
    ...suggestion(
      (action) => store.dispatch(handleSuggestion(action)),
      schema.nodes.variable ? ALL_TRIGGERS : NO_VARIABLE,
      // Cancel on space after some of the triggers
      (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
    ),
    ...commentPlugins(schemaPreset),
    getPromptPlugin(),
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
  ];
}

export function getInlinePlugins(schema: Schema): Plugin[] {
  return [
    editablePlugin(true),
    getCommentsPlugin(),
    ...inputrules(schema),
    keymap(buildBasicKeymap(schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
  ];
}
