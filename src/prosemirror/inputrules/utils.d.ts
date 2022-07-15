import { InputRule } from 'prosemirror-inputrules';
import { NodeType, MarkType, Node } from 'prosemirror-model';
declare type GetAttrs = {
    content?: Node;
    [key: string]: any;
} | ((p: string[]) => {
    content?: Node;
    [key: string]: any;
});
export declare function markInputRule(regexp: RegExp, markType: MarkType, options?: {
    getAttrs?: GetAttrs;
    getText?: (p: string[]) => string;
    getTextAfter?: ((p: string[]) => string) | string;
}): InputRule;
export declare function replaceNodeRule(regExp: RegExp, nodeType: NodeType, getAttrs?: GetAttrs, select?: boolean | ((p: string[]) => boolean), test?: (p: string[]) => boolean): InputRule;
export declare function changeNodeRule(regExp: RegExp, nodeType: NodeType, getAttrs?: GetAttrs): InputRule;
export {};
