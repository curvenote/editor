import { EditorView } from 'prosemirror-view';
import {
  SuggestionActionTypes, SuggestionKind,
  UPDATE_SUGGESTION, UPDATE_RESULTS, SELECT_SUGGESTION,
  Range,
  EmojiResult, SuggestionResult, variableTrigger,
  VariableResult,
} from './types';
import { CommandResult } from './commands';
import { SuggestionAction, KEEP_SELECTION_ALIVE } from '../../prosemirror/plugins/suggestion';
import { AppThunk, State } from '../types';
import { getSuggestion } from './selectors';
import * as emoji from './results/emoji';
import * as command from './results/command';
import * as variable from './results/variable';

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
  setOpen: boolean, kind: SuggestionKind,
  search: string | null,
  view: EditorView,
  range: Range,
  trigger: string,
): SuggestionActionTypes {
  let location;
  let open;
  // This catches a delete past the start of the location.
  try {
    location = view.coordsAtPos(range.from);
    open = setOpen;
  } catch (error) {
    open = false;
    location = null;
  }
  return {
    type: UPDATE_SUGGESTION,
    payload: {
      open,
      kind,
      search,
      view,
      range,
      location,
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
        return dispatch(command.chooseSelection(result as CommandResult));
      case SuggestionKind.variable:
      case SuggestionKind.display:
        return dispatch(variable.chooseSelection(kind, result as VariableResult));
      default: throw new Error('Unknown suggestion kind.');
    }
  };
}

export function filterResults(search: string): AppThunk<void> {
  return (dispatch, getState) => {
    const { kind } = getSuggestion(getState());
    switch (kind) {
      case SuggestionKind.emoji:
        return emoji.filterResults(
          search,
          (results: EmojiResult[]) => dispatch(updateResults(results)),
        );
      case SuggestionKind.command:
        return command.filterResults(
          search,
          (results: CommandResult[]) => dispatch(updateResults(results)),
        );
      case SuggestionKind.variable:
      case SuggestionKind.display:
        return variable.filterResults(
          kind,
          search,
          dispatch,
          getState,
          (results: VariableResult[]) => dispatch(updateResults(results)),
        );
      default: throw new Error('Unknown suggestion kind.');
    }
  };
}

function getStartingSuggestions(kind: SuggestionKind, getState: () => State): SuggestionResult[] {
  switch (kind) {
    case SuggestionKind.emoji: return emoji.startingSuggestions;
    case SuggestionKind.command: return command.startingSuggestions;
    case SuggestionKind.variable:
    case SuggestionKind.display:
      return variable.startingSuggestions(kind, getState);
    default: throw new Error('Unknown suggestion kind.');
  }
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
    if (action.kind === 'open') {
      dispatch(updateResults(getStartingSuggestions(kind, getState)));
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
        dispatch(updateResults(getStartingSuggestions(kind, getState)));
      } else {
        dispatch(filterResults(action.search));
      }
    }
    if (action.kind === 'select') {
      const { selected } = getSuggestion(getState());
      return dispatch(chooseSelection(selected));
    }
    return false;
  };
}
