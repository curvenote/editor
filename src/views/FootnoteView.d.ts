import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { GetPos } from './types';
declare class FootnoteView {
    dom: HTMLElement;
    editor: HTMLElement;
    innerView: EditorView;
    node: Node;
    outerView: EditorView;
    getPos: GetPos;
    constructor(node: Node, view: EditorView, getPos: GetPos);
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
