import { EditorState } from 'prosemirror-state';
import { PopperProps } from '@material-ui/core';
export declare type ActionProps = {
    stateId: any;
    viewId: string | null;
};
declare let popper: {
    update: () => void;
} | null;
export declare function registerPopper(next: typeof popper): void;
export declare function positionPopper(): void;
export declare function getFigure(editorState: EditorState | null): {
    figure: import("prosemirror-utils").ContentNodeWithPos | undefined;
    figcaption: import("prosemirror-utils").NodeWithPos | undefined;
};
declare type NodeOrNodeFunction = (() => Element | null) | Element | null;
export declare type AnchorCache = {
    anchorEl: PopperProps['anchorEl'];
    setNode: (node: NodeOrNodeFunction) => void;
    getNode: () => Element | null;
};
export declare function createPopperLocationCache(): AnchorCache;
export {};
