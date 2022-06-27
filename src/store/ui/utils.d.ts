import { EditorState, Selection } from 'prosemirror-state';
import { nodeNames } from '@curvenote/schema';
import { SelectionKinds } from './types';
export declare function getNodeFromSelection(selection?: Selection): any;
export declare function getNodeIfSelected(state: EditorState | null, nodeName?: nodeNames): any;
export declare const getSelectionKind: (state: EditorState | null) => {
    kind: SelectionKinds;
    pos: number;
} | null;
