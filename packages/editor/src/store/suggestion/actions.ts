import { ActionKind } from 'prosemirror-autocomplete';
import type { AutocompleteAction, KEEP_OPEN } from 'prosemirror-autocomplete';
import type { EditorView } from 'prosemirror-view';
import type { Nodes } from '@curvenote/schema';
import type {
  SuggestionActionTypes,
  Range,
  EmojiResult,
  VariableResult,
  LinkResult,
} from './types';
import {
  SuggestionKind,
  UPDATE_SUGGESTION,
  UPDATE_RESULTS,
  SELECT_SUGGESTION,
  variableTrigger,
} from './types';
import type { CommandResult } from './commands';
import type { AppThunk } from '../types';
import { selectSuggestionState } from './selectors';
import * as emoji from './results/emoji';
import * as command from './results/command';
import * as variable from './results/variable';
import * as link from './results/link';
import * as mention from './results/mention';

export { executeCommand } from './results/command';

// Some utilities
function positiveModulus(n: number, m: number) {
  return ((n % m) + m) % m;
}

function triggerToKind(trigger: string): SuggestionKind {
  switch (trigger) {
    case ':':
      return SuggestionKind.emoji;
    case '/':
      return SuggestionKind.command;
    case '@':
      return SuggestionKind.mention;
    case '[[':
      return SuggestionKind.link;
    case '{{':
      return SuggestionKind.display;
    case (trigger.match(variableTrigger) ?? {}).input:
      return SuggestionKind.variable;
    default:
      throw new Error('Unknown trigger.');
  }
}

export function updateSuggestion(
  open: boolean,
  kind: SuggestionKind,
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

export function closeSuggestion() {
  return {
    type: UPDATE_SUGGESTION,
    payload: {
      open: false,
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

export function chooseSelection(selected: number): AppThunk<boolean | typeof KEEP_OPEN> {
  return (dispatch, getState) => {
    const { kind, results } = selectSuggestionState(getState());
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
      case SuggestionKind.mention:
        dispatch(mention.chooseSelection(result as Nodes.Mention.Attrs));
        return true;
      case SuggestionKind.variable:
      case SuggestionKind.display:
        return dispatch(variable.chooseSelection(kind, result as VariableResult));
      default:
        throw new Error('Unknown suggestion kind.');
    }
  };
}

export function filterResults(view: EditorView, search: string): AppThunk<void> {
  return (dispatch, getState) => {
    const { kind } = selectSuggestionState(getState());
    switch (kind) {
      case SuggestionKind.emoji:
        return emoji.filterResults(view.state.schema, search, (results: EmojiResult[]) =>
          dispatch(updateResults(results)),
        );
      case SuggestionKind.command:
        return command.filterResults(view, search, (results: CommandResult[]) =>
          dispatch(updateResults(results)),
        );
      case SuggestionKind.link:
        return link.filterResults(view.state.schema, search, (results: LinkResult[]) =>
          dispatch(updateResults(results)),
        );
      case SuggestionKind.mention:
        return () => {
          // TODO: a default behavior for this?
        };
      case SuggestionKind.variable:
      case SuggestionKind.display:
        return variable.filterResults(
          kind,
          view.state.schema,
          search,
          dispatch,
          getState,
          (results: VariableResult[]) => dispatch(updateResults(results)),
        );
      default:
        throw new Error('Unknown suggestion kind.');
    }
  };
}

function setStartingSuggestions(
  view: EditorView,
  kind: SuggestionKind,
  search: string,
  create = true,
): AppThunk<void> {
  return async (dispatch, getState) => {
    switch (kind) {
      case SuggestionKind.emoji: {
        dispatch(updateResults(emoji.startingSuggestions));
        return;
      }
      case SuggestionKind.command: {
        const starting = command.startingSuggestions(view);
        dispatch(updateResults(starting));
        return;
      }
      case SuggestionKind.mention:
        dispatch(updateResults([]));
        return;
      case SuggestionKind.link: {
        dispatch(updateResults([]));
        // TODO: this needs to be non-blocking, and show a loading indicator
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
      default:
        throw new Error(`Unknown suggestion kind - ${kind}`);
    }
  };
}

export function handleSuggestion(action: AutocompleteAction): AppThunk<boolean | typeof KEEP_OPEN> {
  return (dispatch, getState) => {
    const suggestionKind = triggerToKind(action.trigger);
    dispatch(
      updateSuggestion(
        action.kind !== ActionKind.close,
        suggestionKind,
        action.filter || null,
        action.view,
        action.range,
        action.trigger,
      ),
    );
    if (action.kind === ActionKind.open) {
      dispatch(setStartingSuggestions(action.view, suggestionKind, action.filter ?? '', true));
      dispatch(selectSuggestion(0));
    }
    if (action.kind === ActionKind.up || action.kind === ActionKind.down) {
      const { results, selected } = selectSuggestionState(getState());
      dispatch(
        selectSuggestion(
          positiveModulus(selected + (action.kind === ActionKind.up ? -1 : +1), results.length),
        ),
      );
      return true;
    }
    if (action.kind === ActionKind.filter) {
      if (action.filter === '' || action.filter == null) {
        dispatch(setStartingSuggestions(action.view, suggestionKind, '', false));
      } else {
        dispatch(filterResults(action.view, action.filter));
      }
    }
    if (action.kind === ActionKind.enter) {
      const { selected } = selectSuggestionState(getState());
      return dispatch(chooseSelection(selected));
    }
    return false;
  };
}
