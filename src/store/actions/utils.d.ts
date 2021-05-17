/// <reference types="prosemirror-model" />
import { schemas } from '@curvenote/schema';
import { EditorState } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
export declare const TEST_LINK: RegExp;
export declare const TEST_LINK_WEAK: RegExp;
export declare const TEST_LINK_SPACE: RegExp;
export declare const TEST_LINK_COMMON_SPACE: RegExp;
export declare const testLink: (possibleLink: string) => boolean;
export declare const testLinkWeak: (possibleLink: string) => boolean;
export declare const addLink: (view: EditorView, data: DataTransfer | null) => boolean;
export declare function updateNodeAttrsOnView(view: EditorView | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>, attrs: {
    [index: string]: any;
}, select?: boolean | 'after'): void;
export declare function getLinkBoundsIfTheyExist(state: EditorState): {
    from: number;
    to: number;
    mark: import("prosemirror-model").Mark<any>;
} | null;
export declare function getNodeIfSelected(state: EditorState | null, nodeName?: schemas.nodeNames): import("prosemirror-model").Node<any> | null;
