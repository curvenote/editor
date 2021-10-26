import { Node } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { GetPos } from './types';
declare class ImageView implements NodeView {
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
export default ImageView;
