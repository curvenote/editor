import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
declare class MathView {
    dom: HTMLElement & {
        editing: boolean;
        requestUpdate: () => void;
    };
    tooltip: HTMLElement;
    innerView: EditorView;
    node: Node;
    outerView: EditorView;
    getPos: (() => number);
    constructor(node: Node, view: EditorView, getPos: (() => number), inline: boolean);
    selectNode(): void;
    deselectNode(): void;
    dispatchInner(tr: Transaction): void;
    update(node: Node): boolean;
    destroy(): void;
    stopEvent(event: any): boolean;
    ignoreMutation(): boolean;
}
export default MathView;
