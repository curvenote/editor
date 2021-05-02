import { Node, NodeSpec } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { AlignOptions } from '../../types';
export declare const TEST_LINK: RegExp;
export declare const TEST_LINK_SPACE: RegExp;
export declare const TEST_LINK_COMMON_SPACE: RegExp;
export declare const addLink: (view: EditorView, data: DataTransfer | null) => boolean;
export declare function updateNodeAttrsOnView(view: EditorView | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>, attrs: {
    [index: string]: any;
}, select?: boolean): void;
export declare function getLinkBoundsIfTheyExist(state: EditorState): {
    from: number;
    to: number;
    mark: import("prosemirror-model").Mark<any>;
} | null;
export declare function getNodeIfSelected(state: EditorState, spec: NodeSpec): Node<any> | null;
export declare const setNodeViewAlign: (node: Node, view: EditorView, pos: number) => (value: AlignOptions) => void;
export declare const setNodeViewWidth: (node: Node, view: EditorView, pos: number) => (value: number) => void;
export declare const setNodeViewKind: (node: Node, view: EditorView, pos: number, select?: boolean) => (value: string) => void;
export declare const setNodeViewDelete: (node: Node, view: EditorView, pos: number) => () => void;
export declare const liftContentOutOfNode: (node: Node, view: EditorView, pos: number) => () => void;
