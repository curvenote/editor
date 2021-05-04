import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { AppThunk, State, Dispatch } from '../../types';
import { getSuggestion } from '../selectors';
import { insertInlineNode, insertVariable } from '../../actions/editor';
import { variableTrigger, VariableResult, SuggestionKind } from '../types';
import { KEEP_SELECTION_ALIVE, cancelSuggestion } from '../../../prosemirror/plugins/suggestion';

type VarSuggestionKinds = SuggestionKind.variable | SuggestionKind.display;

const getFirstSuggestion = (kind: VarSuggestionKinds) => {
  const title = {
    [SuggestionKind.variable]: 'Create Variable',
    [SuggestionKind.display]: 'Create Dynamic Display',
  };
  return {
    id: 'FINISHED',
    name: title[kind],
    description: 'Enter a value or expression. Select the variables below to add them to your expression.',
  } as VariableResult;
};

export const startingSuggestions = (kind: VarSuggestionKinds, getState: () => State) => ([
  getFirstSuggestion(kind),
  ...Object.entries(getState().runtime.variables).map(([, variable]) => variable),
]);

function createVariable(schema: Schema, dispatch: Dispatch, trigger: string, search: string) {
  const name = trigger.match(variableTrigger)?.[1] ?? 'myVar';
  const match = search.match(/^\s?(\$?\d+.?[\d]*)$/);
  if (!match) {
    // This is an expression, put it in the value function:
    dispatch(insertVariable(schema, { name, valueFunction: search.trim() }));
    return true;
  }
  const dollars = match[1].indexOf('$') !== -1 ? '$,' : '';
  const number = match[1].replace('$', '');
  const decimals = number.split('.');
  const numDecimals = decimals.length === 1 ? 0 : decimals[1].length;
  dispatch(insertVariable(schema, { name, value: number, format: `${dollars}.${numDecimals}f` }));
  return true;
}

function createDisplay(schema: Schema, dispatch: Dispatch, search: string) {
  const valueFunction = (search.endsWith('}}') ? search.slice(0, -2) : search).trim();
  dispatch(insertInlineNode(schema.nodes.display, { valueFunction }));
  return true;
}

export function chooseSelection(kind: VarSuggestionKinds, result: VariableResult):
AppThunk<boolean | typeof KEEP_SELECTION_ALIVE> {
  return (dispatch, getState) => {
    const {
      view, range: { from, to }, trigger, search,
    } = getSuggestion(getState());
    if (view == null || search == null) return false;

    if (result.id !== 'FINISHED') {
      const { tr } = view.state;
      tr.insertText(result.name ?? '');
      view.dispatch(tr);
      return KEEP_SELECTION_ALIVE;
    }

    const removeText = () => {
      const { tr } = view.state;
      tr.insertText('', from, to);
      view.dispatch(tr);
      return true;
    };
    const { schema } = view.state;
    removeText();
    switch (kind) {
      case SuggestionKind.variable:
        return createVariable(schema, dispatch, trigger, search);
      case SuggestionKind.display:
        return createDisplay(schema, dispatch, search);
      default:
        throw new Error('Unknown suggestion kind.');
    }
  };
}

export function filterResults(
  kind: VarSuggestionKinds,
  schema: Schema,
  search: string,
  dispatch: Dispatch,
  getState: () => State,
  callback: (results: VariableResult[]) => void,
): void {
  if (kind === SuggestionKind.display && search.endsWith('}}')) {
    cancelSuggestion(getState().editor.suggestion.view as EditorView);
    // Not sure why this needs to be async
    setTimeout(() => dispatch(chooseSelection(kind, getFirstSuggestion(kind))), 5);
    return;
  }

  // This lets the keystroke go through:
  setTimeout(() => {
    const results = [
      getFirstSuggestion(kind),
      ...Object.entries(getState().runtime.variables).map(([, variable]) => variable),
    ];
    callback(results);
  }, 1);
}
