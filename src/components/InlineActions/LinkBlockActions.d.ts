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
    node: import("prosemirror-model").Node<import("prosemirror-model").Schema<"paragraph" | "text" | "display" | "dynamic" | "range" | "switch" | "button" | "variable" | "math" | "equation" | "cite" | "cite_group" | "aside" | "callout" | "link_block" | "iframe" | "table" | "table_row" | "table_cell" | "table_header" | "ordered_list" | "bullet_list" | "list_item" | "doc" | "heading" | "footnote" | "blockquote" | "code_block" | "figure" | "figcaption" | "image" | "horizontal_rule" | "hard_break" | "time", "link" | "code" | "em" | "strong" | "superscript" | "subscript" | "strikethrough" | "underline" | "abbr">> | undefined;
};
declare function LinkBlockActions(props: ActionProps): JSX.Element | null;
export default LinkBlockActions;
