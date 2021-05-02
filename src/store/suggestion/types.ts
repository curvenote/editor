import { types } from '@curvenote/runtime';
import { EditorView } from 'prosemirror-view';
import { CitationFormat } from '../../types';
import { CommandResult } from './commands';

export const UPDATE_SUGGESTION = 'UPDATE_SUGGESTION';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const SELECT_SUGGESTION = 'SELECT_SUGGESTION';

export const variableTrigger = /^([a-zA-Z0-9_]+)\s?=/;

export enum SuggestionKind {
  'emoji',
  'person',
  'link',
  'command',
  'variable',
  'display',
}

export interface EmojiResult {
  c: string; // Character
  n: string; // Name
  s: string; // Short Name
  o: string; // Other Name
}

export type LinkResult = CitationFormat;

export type VariableResult = Partial<types.Variable>;

export type SuggestionResult = EmojiResult | CommandResult | VariableResult | LinkResult;

export type Location = {
  left: number;
  right: number;
  top: number;
  bottom: number;
} | DOMRect;

export type Range = { from: number; to: number };

export type SuggestionState = {
  view: EditorView | null;
  open: boolean;
  trigger: string;
  kind: SuggestionKind | null;
  search: string | null;
  range: Range;
  selected: number;
  results: SuggestionResult[];
};

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

export type SuggestionActionTypes = (
  UpdateSuggestionAction |
  UpdateSuggestionResultsAction |
  UpdateSuggestionSelectionAction
);
