import { nodeNames, CaptionKind, Nodes } from '@curvenote/schema';
import { EditorState, Transaction } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { Node, Schema } from 'prosemirror-model';
export declare const TEST_LINK_SPACE: RegExp;
export declare const TEST_LINK_COMMON_SPACE: RegExp;
export declare const TEST_LINK_COMMON: RegExp;
export declare function validateUrl(url: string): boolean;
export declare function validateEmail(url: string): RegExpMatchArray | null;
export declare function normalizeUrl(url: string): string;
export declare const addLink: (view: EditorView, data: DataTransfer | null) => boolean;
export declare function updateNodeAttrsOnView(view: EditorView | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>, attrs: {
    [index: string]: any;
}, select?: boolean | 'after'): void;
export declare function createFigureCaption(schema: Schema, kind: CaptionKind, src?: string): Node<Schema<any, any>>;
export declare function createFigure(schema: Schema, node: Node, caption?: boolean, initialFigureState?: Partial<Nodes.Figure.Attrs>): Node<any>;
export declare function selectFirstNodeOfTypeInParent(nodeName: nodeNames | nodeNames[], tr: Transaction, parentPos: number): Transaction;
export declare function insertParagraphAndSelect(schema: Schema, tr: Transaction, side: number): Transaction<any>;
export declare function getLinkBoundsIfTheyExist(state?: EditorState | null, pos?: number): {
    from: number;
    to: number;
    mark: import("prosemirror-model").Mark<any>;
} | null;
