import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
declare class TimeView {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    getPos?: () => number;
    constructor(node: Node, view: EditorView, getPos: (() => number) | undefined);
    update(node: Node): boolean;
    setDate(): void;
}
export default TimeView;
