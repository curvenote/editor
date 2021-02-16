import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import CiteEditor from './CiteEditor';
declare class CiteView {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    editor: null | CiteEditor;
    getPos: (() => number);
    constructor(node: Node, view: EditorView, getPos: (() => number));
    selectNode(): void;
    deselectNode(): void;
    update(node: Node): boolean;
    destroy(): void;
}
export default CiteView;
