import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
declare class WidgetView {
    dom: HTMLElement;
    widget: HTMLElement;
    node: Node;
    view: EditorView;
    getPos?: () => number;
    constructor(node: Node, view: EditorView, getPos: (() => number) | undefined);
    selectNode(): void;
    deselectNode(): void;
    update(node: Node): boolean;
    setAttrs(node: Node): void;
}
export declare const newWidgetView: (node: Node, view: EditorView, getPos: boolean | (() => number)) => WidgetView;
export default WidgetView;
