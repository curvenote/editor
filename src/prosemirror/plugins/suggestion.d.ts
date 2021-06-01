import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export declare const SUGGESTION_ID = "suggestion";
export declare const KEEP_SELECTION_ALIVE = "KEEP_SELECTION_ALIVE";
interface Range {
    from: number;
    to: number;
}
export declare const key: PluginKey<any, any>;
export declare function triggerSuggestion(view: EditorView, trigger: string, search?: string): void;
export declare enum SuggestionActionKind {
    'open' = "open",
    'close' = "close",
    'filter' = "filter",
    'previous' = "previous",
    'next' = "next",
    'select' = "select"
}
export interface SuggestionAction {
    kind: SuggestionActionKind;
    view: EditorView;
    trigger: string;
    search: string | null;
    range: Range;
}
export declare function cancelSuggestion(view: EditorView): boolean;
export default function getPlugins(onAction?: (action: SuggestionAction) => boolean | typeof KEEP_SELECTION_ALIVE, suggestionTrigger?: RegExp, cancelOnFirstSpace?: ((trigger: string | null) => boolean) | boolean, suggestionClass?: string): Plugin<any, any>[];
export {};
