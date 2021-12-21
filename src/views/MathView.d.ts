import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { GetPos } from './types';
export declare function renderMath(math: string, element: HTMLElement, inline: boolean): Promise<void>;
declare class MathOrEquationView {
    dom: HTMLElement;
    editor: HTMLElement;
    math: HTMLElement;
    inline: boolean;
    innerView: EditorView;
    node: Node;
    outerView: EditorView;
    getPos: GetPos;
    constructor(node: Node, view: EditorView, getPos: GetPos, inline: boolean);
    selectNode(): void;
    deselectNode(): void;
    dispatchInner(tr: Transaction): void;
    addFakeCursor(): void;
    update(node: Node): boolean;
    renderMath(): void;
    destroy(): void;
    stopEvent(event: any): boolean;
    ignoreMutation(): boolean;
}
export declare function MathView(node: Node, view: EditorView, getPos: GetPos): MathOrEquationView;
export declare function EquationView(node: Node, view: EditorView, getPos: GetPos): MathOrEquationView;
export {};
