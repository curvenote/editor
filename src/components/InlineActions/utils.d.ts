import { EditorState } from 'prosemirror-state';
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
export {};
