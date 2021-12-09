import { types } from '@curvenote/runtime';
import { ReferenceKind } from '@curvenote/schema';
import { EditorView } from 'prosemirror-view';
import { CommandResult } from './commands';

export const UPDATE_SUGGESTION = 'UPDATE_SUGGESTION';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const SELECT_SUGGESTION = 'SELECT_SUGGESTION';
export const UPDATE_SUGGESTION_DATA = 'UPDATE_SUGGESTION_DATA';

export const variableTrigger = /^([a-zA-Z0-9_]+)\s?=/;

export enum SuggestionKind {
  'emoji' = 'emoji',
  'link' = 'link',
  'command' = 'command',
  'variable' = 'variable',
  'display' = 'display',
  'mention' = 'mention',
}

export interface EmojiResult {
  c: string; // Character
  n: string; // Name
  s: string; // Short Name
  o: string; // Other Name
}

export type LinkResult = {
  kind: ReferenceKind;
  uid: string;
  title: string | null;
  label: string | null;
  content: string;
  linkKind?: string;
};

export type VariableResult = Partial<types.Variable>;

export type { CommandResult };

export type SuggestionResult = EmojiResult | CommandResult | VariableResult | LinkResult;

export type Location =
  | {
      left: number;
      right: number;
      top: number;
      bottom: number;
    }
  | DOMRect;

export type Range = { from: number; to: number };

export type SuggestionEditorState = {
  view: EditorView | null;
  open: boolean;
  trigger: string;
  kind: SuggestionKind | null;
  search: string | null;
  range: Range;
  selected: number;
  results: SuggestionResult[];
};

export interface SuggestionState {
  editorState: SuggestionEditorState;
  data: Partial<Record<SuggestionKind, any[]>>;
}

export interface UpdateSuggestionAction {
  type: typeof UPDATE_SUGGESTION;
  payload: {
    open: boolean;
    view: EditorView | null;
    kind: SuggestionKind | null;
    range: Range;
    search: string | null;
    trigger: string;
  };
}

export interface UpdateSuggestionResultsAction {
  type: typeof UPDATE_RESULTS;
  payload: {
    results: any[];
  };
}

export interface UpdateSuggestionSelectionAction {
  type: typeof SELECT_SUGGESTION;
  payload: {
    selection: number;
  };
}

export interface UpdateSuggestionDataAction {
  type: typeof UPDATE_SUGGESTION_DATA;
  payload: {
    kind: SuggestionKind;
    data: any[];
  };
}

export type SuggestionActionTypes =
  | UpdateSuggestionAction
  | UpdateSuggestionResultsAction
  | UpdateSuggestionSelectionAction
  | UpdateSuggestionDataAction;
