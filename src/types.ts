import { DecorationAttrs, DecorationSet, EditorView } from 'prosemirror-view';

export const KEEP_OPEN = 'KEEP_OPEN';

export interface FromTo {
  from: number;
  to: number;
}

export type InactiveAutocompleteState = {
  active: false;
  decorations: DecorationSet;
};

export type ActiveAutocompleteState = {
  active: true;
  decorations: DecorationSet;
  trigger: string;
  text: string;
  range: FromTo;
  type: Trigger | null;
};

export type AutocompleteState = InactiveAutocompleteState | ActiveAutocompleteState;

export enum ActionKind {
  'open' = 'open',
  'close' = 'close',
  'filter' = 'filter',
  'previous' = 'previous',
  'next' = 'next',
  'select' = 'select',
}

export interface AutocompleteAction {
  kind: ActionKind;
  view: EditorView;
  trigger: string;
  search?: string;
  range: FromTo;
  type: Trigger | null;
}

export interface OpenAutocomplete {
  action: 'add';
  trigger: string;
  search?: string;
  type: Trigger | null;
}

export interface CloseAutocomplete {
  action: 'remove';
}

export type AutocompleteTrMeta = OpenAutocomplete | CloseAutocomplete;

export type Trigger = {
  name: string;
  trigger: string | RegExp;
  cancelOnFirstSpace?: boolean; // Default is true
  decorationAttrs?: DecorationAttrs;
};

export type Options = {
  reducer?: (action: AutocompleteAction) => boolean | typeof KEEP_OPEN;
  triggers?: Trigger[];
};
