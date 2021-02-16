import { NodeSpec } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
export declare const TEST_LINK: RegExp;
export declare const TEST_LINK_SPACE: RegExp;
export declare const TEST_LINK_COMMON_SPACE: RegExp;
export declare const addLink: (view: EditorView, data: DataTransfer | null) => boolean;
export declare function updateNodeAttrsOnView(view: EditorView | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>, attrs: {
    [index: string]: any;
}): void;
export declare function getLinkBoundsIfTheyExist(state: EditorState): {
    from: number;
    to: number;
    link: import("prosemirror-model").Mark<any>;
} | null;
export declare function getNodeIfSelected(state: EditorState, spec: NodeSpec): import("prosemirror-model").Node<any> | null;
