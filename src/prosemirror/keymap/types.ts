import { Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';

export type KeyMap = (
  state: EditorState<Schema>,
  dispatch?: (p: Transaction<Schema>) => void,
) => boolean;
