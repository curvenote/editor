import { schemas } from '@curvenote/schema';
export declare enum CommandNames {
    'link' = "link",
    'callout' = "callout",
    'aside' = "aside",
    'math' = "math",
    'equation' = "equation",
    'horizontal_rule' = "horizontal_rule",
    'bullet_list' = "bullet_list",
    'ordered_list' = "ordered_list",
    'emoji' = "emoji",
    'paragraph' = "paragraph",
    'heading1' = "heading1",
    'heading2' = "heading2",
    'heading3' = "heading3",
    'heading4' = "heading4",
    'heading5' = "heading5",
    'heading6' = "heading6",
    'code' = "code",
    'quote' = "quote",
    'variable' = "variable",
    'display' = "display",
    'range' = "range",
    'dynamic' = "dynamic",
    'switch' = "switch",
    'button' = "button",
    'youtube' = "youtube",
    'loom' = "loom",
    'vimeo' = "vimeo",
    'miro' = "miro",
    'iframe' = "iframe",
    'citation' = "citation"
}
export interface CommandResult {
    name: CommandNames;
    title: string;
    description: string;
    image?: string;
    shortcut?: string | string[];
    node?: keyof typeof schemas.nodes;
}
export declare const commands: CommandResult[];
