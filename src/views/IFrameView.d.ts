import { Node } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
declare class ImageView implements NodeView {
    dom: HTMLDivElement;
    div: HTMLDivElement;
    iframe: HTMLIFrameElement;
    node: Node;
    view: EditorView;
    getPos?: () => number;
    constructor(node: Node, view: EditorView, getPos: () => number);
    selectNode(): void;
    deselectNode(): void;
}
export default ImageView;
