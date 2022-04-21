import React from 'react';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { GetPos, NodeViewProps } from './types';
export declare type Options = {
    wrapper: 'span' | 'div';
    className?: string;
    enableSelectionHighlight?: boolean;
};
export declare type ClassWrapperProps = {
    node: Node;
    view: EditorView;
    getPos: GetPos;
    Child: React.FunctionComponent<NodeViewProps>;
};
export declare class ReactWrapper {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    editor: null | React.Component;
    getPos: GetPos;
    isSelectionHighlightEnabled: boolean;
    constructor(NodeView: React.FunctionComponent<NodeViewProps>, nodeViewPos: Omit<ClassWrapperProps, 'Child'>, options: Options);
    selectNode(): void;
    deselectNode(): void;
    update(node: Node): boolean;
}
declare function createNodeView(Editor: React.FunctionComponent<NodeViewProps>, options?: Options): (node: Node, view: EditorView, getPos: boolean | GetPos) => ReactWrapper;
export default createNodeView;
