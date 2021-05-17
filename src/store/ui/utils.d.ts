import { EditorState } from 'prosemirror-state';
import { SelectionKinds } from './types';
export declare const getSelectionKind: (state: EditorState | null) => {
    kind: SelectionKinds;
    pos: number;
} | null;
