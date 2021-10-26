import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { GetPos } from './types';
declare class TimeView {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    getPos?: GetPos;
    constructor(node: Node, view: EditorView, getPos?: GetPos);
    update(node: Node): boolean;
    setDate(): void;
}
export default TimeView;
