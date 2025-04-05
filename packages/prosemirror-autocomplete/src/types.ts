import type { DecorationAttrs, DecorationSet, EditorView } from 'prosemirror-view';

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
  filter: string;
  range: FromTo;
  type: Trigger | null;
};

export type AutocompleteState = InactiveAutocompleteState | ActiveAutocompleteState;

export enum ActionKind {
  'open' = 'open',
  'close' = 'close',
  'filter' = 'filter',
  'up' = 'ArrowUp',
  'down' = 'ArrowDown',
  'left' = 'ArrowLeft',
  'right' = 'ArrowRight',
  'enter' = 'enter',
}

export type AutocompleteAction = {
  kind: ActionKind;
  view: EditorView;
  trigger: string;
  filter?: string;
  range: FromTo;
  type: Trigger | null;
  event?: KeyboardEvent;
};

export interface OpenAutocomplete {
  action: 'add';
  trigger: string;
  filter?: string;
  type: Trigger | null;
}

export interface CloseAutocomplete {
  action: 'remove';
}

export type AutocompleteTrMeta = OpenAutocomplete | CloseAutocomplete;

export type Trigger = {
  name: string;
  trigger: string | RegExp;
  /** When `true`, a space anywhere in the filter cancels autocompletion, and
   * the value of `cancelOnFirstSpace` is ignored.  (default: `false`) */
  cancelOnSpace?: boolean;
  /** When `true`, a space in the initial position of the filter cancels
   * autocompletion, while spaces elsewhere are allowed.  (default: `true`) */
  cancelOnFirstSpace?: boolean;
  allArrowKeys?: boolean; // Default is false
  decorationAttrs?: DecorationAttrs;
};

export type Options = {
  onOpen?: (action: AutocompleteAction) => boolean;
  onClose?: (action: AutocompleteAction) => boolean;
  onFilter?: (action: AutocompleteAction) => boolean;
  onArrow?: (action: AutocompleteAction) => boolean;
  onEnter?: (action: AutocompleteAction) => boolean;
  reducer: (action: AutocompleteAction) => boolean | typeof KEEP_OPEN;
  triggers: Trigger[];
};
