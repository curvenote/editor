import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
declare class ImageView {
    dom: HTMLDivElement;
    img: HTMLImageElement;
    node: Node;
    view: EditorView;
    getPos?: () => number;
    constructor(node: Node, view: EditorView, getPos: () => number);
    selectNode(): void;
    deselectNode(): void;
}
export default ImageView;
