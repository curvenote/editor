import React from 'react';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { NodeViewProps } from './types';
export declare type Options = {
    wrapper: 'span' | 'div';
    className?: string;
};
export declare type ClassWrapperProps = {
    node: Node;
    view: EditorView;
    getPos: () => number;
    Child: React.FunctionComponent<NodeViewProps>;
};
export declare class ReactWrapper {
    dom: HTMLElement;
    node: Node;
    view: EditorView;
    editor: null | React.Component;
    getPos: () => number;
    constructor(NodeView: React.FunctionComponent<NodeViewProps>, nodeViewPos: Omit<ClassWrapperProps, 'Child'>, options: Options);
    selectNode(): void;
    deselectNode(): void;
    update(node: Node): boolean;
}
declare function createNodeView(Editor: React.FunctionComponent<NodeViewProps>, options?: Options): (node: Node, view: EditorView, getPos: boolean | (() => number)) => ReactWrapper;
export default createNodeView;
