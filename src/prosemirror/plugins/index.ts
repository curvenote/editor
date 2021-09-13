import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { collab } from 'prosemirror-collab';
import { Schema } from 'prosemirror-model';
import { columnResizing, tableEditing, goToNextCell } from 'prosemirror-tables';
import suggestion from './suggestion';
import { buildKeymap } from '../keymap';
import inputrules from '../inputrules';
import { store } from '../../connect';
import { editablePlugin } from './editable';
import { handleSuggestion } from '../../store/suggestion/actions';
import commentsPlugin from './comments';
import { getImagePlaceholderPlugin } from './ImagePlaceholder';
import getPromptPlugin from './prompts';

const ALL_TRIGGERS = /(?:^|\s|\n|[^\d\w])(:|\/|(?:(?:^[a-zA-Z0-9_]+)\s?=)|(?:\{\{)|(?:\[\[))$/;
const NO_VARIABLE = /(?:^|\s|\n|[^\d\w])(:|\/|(?:\{\{)|(?:\[\[))$/;

export function getPlugins(schema: Schema, stateKey: any, version: number, startEditable: boolean) {
  return [
    columnResizing({}),
    tableEditing(),
    keymap({
      Tab: goToNextCell(1),
      'Shift-Tab': goToNextCell(-1),
    }),
    editablePlugin(startEditable),
    ...suggestion(
      (action) => store.dispatch(handleSuggestion(action)),
      schema.nodes.variable ? ALL_TRIGGERS : NO_VARIABLE,
      // Cancel on space after some of the triggers
      (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
    ),
    commentsPlugin(),
    getPromptPlugin(),
    getImagePlaceholderPlugin(),
    inputrules(schema),
    keymap(buildKeymap(stateKey, schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    collab({ version }),
    history(),
  ];
}
