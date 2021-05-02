import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
declare class LinkView {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    getPos?: () => number;
    constructor(node: Node, view: EditorView, getPos: (() => number) | undefined);
}
export default LinkView;
