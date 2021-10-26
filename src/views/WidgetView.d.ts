import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { GetPos } from './types';
declare class WidgetView {
    dom: HTMLElement;
    widget: HTMLElement;
    node: Node;
    view: EditorView;
    getPos?: GetPos;
    constructor(node: Node, view: EditorView, getPos?: GetPos);
    selectNode(): void;
    deselectNode(): void;
    update(node: Node): boolean;
    setAttrs(node: Node): void;
}
export declare const newWidgetView: (node: Node, view: EditorView, getPos: boolean | GetPos) => WidgetView;
export default WidgetView;
