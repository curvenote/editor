import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { GetPos } from './types';
declare class TimeNodeView {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    getPos?: GetPos;
    constructor(node: Node, view: EditorView, getPos?: GetPos);
    update(node: Node): boolean;
    setDate(): void;
}
export declare function TimeView(node: Node, view: EditorView, getPos: GetPos): TimeNodeView;
export {};
