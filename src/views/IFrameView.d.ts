import { Node } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { GetPos } from './types';
declare class IFrameNodeView implements NodeView {
    dom: HTMLDivElement;
    div: HTMLDivElement;
    iframe: HTMLIFrameElement;
    node: Node;
    view: EditorView;
    getPos?: GetPos;
    constructor(node: Node, view: EditorView, getPos: GetPos);
    selectNode(): void;
    deselectNode(): void;
}
export declare function IFrameView(node: Node, view: EditorView, getPos: GetPos): IFrameNodeView;
export {};
