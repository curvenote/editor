import { Transaction } from 'prosemirror-state';
import { MarkType, NodeType, Node, Schema } from 'prosemirror-model';
import { Nodes } from '@curvenote/schema';
import { ContentNodeWithPos } from 'prosemirror-utils1';
import { AppThunk } from '../types';
export declare function updateNodeAttrs(stateKey: any, viewId: string | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>, attrs: {
    [index: string]: any;
}, select?: boolean | 'after' | 'inside'): AppThunk<boolean>;
export declare function deleteNode(stateKey: any, viewId: string | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>): AppThunk<boolean>;
export declare function liftContentOutOfNode(stateKey: any, viewId: string | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>): AppThunk<boolean>;
export declare function toggleMark(stateKey: any, viewId: string | null, mark?: MarkType, attrs?: {
    [key: string]: any;
}): AppThunk<boolean>;
export declare function removeMark(stateKey: any, viewId: string | null, mark: MarkType, from: number, to: number): AppThunk<boolean>;
export declare function wrapInList(stateKey: string, viewId: string | null, node: NodeType, test?: boolean): AppThunk<boolean>;
export declare function wrapIn(node: NodeType): AppThunk<boolean>;
export declare function selectNode(tr: Transaction, select?: boolean | 'after'): Transaction;
export declare function replaceSelection(node: NodeType, attrs?: {
    [index: string]: any;
}, content?: Node): AppThunk<boolean>;
export declare function insertNode(node: NodeType, attrs?: {
    [index: string]: any;
}, content?: Node): AppThunk<boolean>;
export declare function insertInlineNode(node?: NodeType, attrs?: {
    [index: string]: any;
}, content?: Node, select?: boolean | 'after'): AppThunk<boolean>;
export declare function insertText(text: string): AppThunk<boolean>;
export declare const wrapInHeading: (schema: Schema, level: number) => AppThunk<boolean>;
export declare const insertVariable: (schema: Schema, attrs?: Nodes.Variable.Attrs) => AppThunk<boolean>;
export declare function addComment(viewId: string, commentId: string): AppThunk<boolean>;
export declare function removeComment(viewId: string, commentId: string): AppThunk<boolean>;
export declare function addCommentToSelectedView(commentId: string): AppThunk<boolean>;
export declare function toggleCitationBrackets(): AppThunk<boolean>;
