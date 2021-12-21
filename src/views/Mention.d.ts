import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { GetPos } from './types';
declare class MentionNodeView {
    node: Node;
    view: EditorView;
    getPos: boolean | GetPos;
    dom: HTMLSpanElement;
    constructor(node: Node, view: EditorView, getPos: boolean | GetPos);
    update(node: Node): boolean;
    setData(): void;
}
export declare function MentionView(node: Node, view: EditorView, getPos: GetPos): MentionNodeView;
export {};
