import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { GetPos } from './types';
declare class LinkView {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    getPos?: GetPos;
    constructor(node: Node, view: EditorView, getPos?: GetPos);
}
export default LinkView;
