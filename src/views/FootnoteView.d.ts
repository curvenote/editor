import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
declare class FootnoteView {
    dom: HTMLElement;
    editor: HTMLElement;
    innerView: EditorView;
    node: Node;
    outerView: EditorView;
    getPos: () => number;
    constructor(node: Node, view: EditorView, getPos: () => number);
    positionTooltip(): void;
    selectNode(): void;
    deselectNode(): void;
    dispatchInner(tr: Transaction): void;
    update(node: Node): boolean;
    destroy(): void;
    stopEvent(event: any): boolean;
    ignoreMutation(): boolean;
}
export default FootnoteView;
