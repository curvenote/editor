import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import {
  SuggestionActionTypes, SuggestionKind,
  UPDATE_SUGGESTION, UPDATE_RESULTS, SELECT_SUGGESTION,
  Range,
  EmojiResult, variableTrigger,
  VariableResult,
  LinkResult,
} from './types';
import { CommandResult } from './commands';
import { SuggestionAction, KEEP_SELECTION_ALIVE } from '../../prosemirror/plugins/suggestion';
import { AppThunk } from '../types';
import { getSuggestion } from './selectors';
import * as emoji from './results/emoji';
import * as command from './results/command';
import * as variable from './results/variable';
import * as link from './results/link';

export { executeCommand } from './results/command';

// Some utilities
function positiveModulus(n: number, m: number) {
  return ((n % m) + m) % m;
}

function triggerToKind(trigger: string): SuggestionKind {
  switch (trigger) {
    case ':': return SuggestionKind.emoji;
    case '/': return SuggestionKind.command;
    case '@': return SuggestionKind.person;
    case '[[': return SuggestionKind.link;
    case '{{': return SuggestionKind.display;
    case (trigger.match(variableTrigger) ?? {}).input: return SuggestionKind.variable;
    default: throw new Error('Unknown trigger.');
  }
}

export function updateSuggestion(
  open: boolean, kind: SuggestionKind,
  search: string | null,
  view: EditorView,
  range: Range,
  trigger: string,
): SuggestionActionTypes {
  return {
    type: UPDATE_SUGGESTION,
    payload: {
      open,
      kind,
      search,
      view,
      range,
      trigger,
    },
  };
}

export function updateResults(results: any[]): SuggestionActionTypes {
  return {
    type: UPDATE_RESULTS,
    payload: {
      results,
    },
  };
}


export function selectSuggestion(selection: number): SuggestionActionTypes {
  return {
    type: SELECT_SUGGESTION,
    payload: {
      selection,
    },
  };
}

export function chooseSelection(selected: number): AppThunk<boolean | typeof KEEP_SELECTION_ALIVE> {
  return (dispatch, getState) => {
    const { kind, results } = getSuggestion(getState());
    const result = results[selected];
    if (result == null) return false;
    switch (kind) {
      case SuggestionKind.emoji:
        return dispatch(emoji.chooseSelection(result as EmojiResult));
      case SuggestionKind.command:
        dispatch(command.chooseSelection(result as CommandResult));
        return true;
      case SuggestionKind.link:
        dispatch(link.chooseSelection(result as LinkResult));
        return true;
      case SuggestionKind.variable:
      case SuggestionKind.display:
        return dispatch(variable.chooseSelection(kind, result as VariableResult));
      default: throw new Error('Unknown suggestion kind.');
    }
  };
}

export function filterResults(schema: Schema, search: string): AppThunk<void> {
  return (dispatch, getState) => {
    const { kind } = getSuggestion(getState());
    switch (kind) {
      case SuggestionKind.emoji:
        return emoji.filterResults(
          schema, search,
          (results: EmojiResult[]) => dispatch(updateResults(results)),
        );
      case SuggestionKind.command:
        return command.filterResults(
          schema, search,
          (results: CommandResult[]) => dispatch(updateResults(results)),
        );
      case SuggestionKind.link:
        return link.filterResults(
          schema, search,
          (results: LinkResult[]) => dispatch(updateResults(results)),
        );
      case SuggestionKind.variable:
      case SuggestionKind.display:
        return variable.filterResults(
          kind,
          schema,
          search,
          dispatch,
          getState,
          (results: VariableResult[]) => dispatch(updateResults(results)),
        );
      default: throw new Error('Unknown suggestion kind.');
    }
  };
}

function setStartingSuggestions(
  schema: Schema, kind: SuggestionKind, search: string, create = true,
): AppThunk<void> {
  return async (dispatch, getState) => {
    switch (kind) {
      case SuggestionKind.emoji: {
        dispatch(updateResults(emoji.startingSuggestions));
        return;
      }
      case SuggestionKind.command: {
        const starting = command.startingSuggestions(schema);
        dispatch(updateResults(starting));
        return;
      }
      case SuggestionKind.link: {
        dispatch(updateResults([]));
        const suggestions = await link.startingSuggestions(search, create);
        dispatch(updateResults(suggestions));
        return;
      }
      case SuggestionKind.variable:
      case SuggestionKind.display: {
        const suggestions = variable.startingSuggestions(kind, getState);
        dispatch(updateResults(suggestions));
        return;
      }
      default: throw new Error('Unknown suggestion kind.');
    }
  };
}

export function handleSuggestion(action: SuggestionAction):
AppThunk<boolean | typeof KEEP_SELECTION_ALIVE> {
  return (dispatch, getState) => {
    const kind = triggerToKind(action.trigger);
    dispatch(updateSuggestion(
      action.kind !== 'close',
      kind,
      action.search,
      action.view,
      action.range,
      action.trigger,
    ));
    const { schema } = action.view.state;
    if (action.kind === 'open') {
      dispatch(setStartingSuggestions(schema, kind, action.search ?? '', true));
      dispatch(selectSuggestion(0));
    }
    if (action.kind === 'previous' || action.kind === 'next') {
      const { results, selected } = getSuggestion(getState());
      dispatch(selectSuggestion(positiveModulus(
        (selected + (action.kind === 'previous' ? -1 : +1)),
        results.length,
      )));
      return true;
    }
    if (action.kind === 'filter') {
      if (action.search === '' || action.search == null) {
        dispatch(setStartingSuggestions(schema, kind, '', false));
      } else {
        dispatch(filterResults(action.view.state.schema, action.search));
      }
    }
    if (action.kind === 'select') {
      const { selected } = getSuggestion(getState());
      return dispatch(chooseSelection(selected));
    }
    return false;
  };
}
