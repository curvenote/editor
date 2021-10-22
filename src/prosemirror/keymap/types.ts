import { Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export type KeyMap = (
  state: EditorState<Schema>,
  dispatch?: (p: Transaction<Schema>) => void,
  view?: EditorView,
) => boolean;
