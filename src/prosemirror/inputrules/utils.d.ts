import { InputRule } from 'prosemirror-inputrules';
import { NodeType, MarkType, Node } from 'prosemirror-model';
declare type GetAttrs = {
    content?: Node<any>;
    [key: string]: any;
} | ((p: string[]) => {
    content?: Node<any>;
    [key: string]: any;
});
export declare function markInputRule(regexp: RegExp, markType: MarkType, options?: {
    getAttrs?: GetAttrs;
    getText?: (p: string[]) => string;
    addSpace?: boolean;
}): InputRule<any>;
export declare function replaceNodeRule(regExp: RegExp, nodeType: NodeType, getAttrs?: GetAttrs, select?: boolean | ((p: string[]) => boolean), test?: (p: string[]) => boolean): InputRule<any>;
export declare function changeNodeRule(regExp: RegExp, nodeType: NodeType, getAttrs?: GetAttrs): InputRule<any>;
export {};
