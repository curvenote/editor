import { EditorState, Selection } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { nodeNames } from '@curvenote/schema';
import { SelectionKinds } from './types';
export declare function getNodeFromSelection(selection?: Selection): Node<any> | null;
export declare function getNodeIfSelected(state: EditorState | null, nodeName?: nodeNames): Node<any> | null;
export declare const getSelectionKind: (state: EditorState | null) => {
    kind: SelectionKinds;
    pos: number;
} | null;
