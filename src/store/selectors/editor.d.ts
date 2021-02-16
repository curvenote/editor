import { MarkType, NodeType } from 'prosemirror-model';
import { ContentNodeWithPos } from 'prosemirror-utils';
import { State } from '../types';
export declare function getParentsOfSelection(state: State, stateKey: any | null): ContentNodeWithPos[];
export declare function getNodeAttrs(state: State, stateId: any | null, pos: number): {
    [key: string]: any;
} | null;
export declare function menuActive(state: State, stateId: any | null): boolean;
export declare function selectionIsMarkedWith<T extends Record<string, any>>(state: State, stateKey: any | null, types: Record<keyof T, MarkType>): Record<keyof T, boolean>;
export declare function selectionIsChildOf<T extends Record<string, any>>(state: State, stateKey: any | null, nodes: Record<keyof T, NodeType>): Record<keyof T, boolean>;
export declare function selectionIsThisNodeType<T extends Record<string, any>>(state: State, stateKey: any | null, nodes: Record<keyof T, NodeType>): Record<keyof T, boolean>;
