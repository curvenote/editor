/// <reference types="react" />
import { ActionProps } from './utils';
export declare function useLinkBlockActions(stateId: any, viewId: string | null): {
    attrs: {
        [key: string]: any;
    } | null;
    tooltip: any;
    onOpen: () => void;
    onDelete: () => void;
    onEdit: (newHref: string) => void;
    node: import("prosemirror-model").Node<import("prosemirror-model").Schema<"aside" | "blockquote" | "button" | "cite" | "figcaption" | "figure" | "iframe" | "table" | "time" | "image" | "switch" | "text" | "paragraph" | "display" | "dynamic" | "range" | "variable" | "math" | "equation" | "cite_group" | "callout" | "link_block" | "table_row" | "table_cell" | "table_header" | "ordered_list" | "bullet_list" | "list_item" | "doc" | "heading" | "footnote" | "code_block" | "horizontal_rule" | "hard_break", "link" | "abbr" | "code" | "em" | "strong" | "superscript" | "subscript" | "strikethrough" | "underline">> | undefined;
};
declare function LinkBlockActions(props: ActionProps): JSX.Element | null;
export default LinkBlockActions;
