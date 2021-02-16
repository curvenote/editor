import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import ImageEditor from './IFrameEditor';
declare class IFrameView {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    editor: null | ImageEditor;
    currentSrc: string;
    getPos: (() => number);
    constructor(node: Node, view: EditorView, getPos: (() => number));
    selectNode(): void;
    deselectNode(): void;
    update(node: Node): boolean;
    destroy(): void;
}
export default IFrameView;
