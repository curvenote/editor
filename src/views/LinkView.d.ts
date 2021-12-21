import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { GetPos } from './types';
declare class LinkNodeView {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    getPos?: GetPos;
    constructor(node: Node, view: EditorView, getPos?: GetPos);
}
export declare function LinkView(node: Node, view: EditorView, getPos: GetPos): LinkNodeView;
export {};
