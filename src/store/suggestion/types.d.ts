import { types } from '@curvenote/runtime';
import { ReferenceKind } from '@curvenote/schema';
import { EditorView } from 'prosemirror-view';
import { CommandResult } from './commands';
export declare const UPDATE_SUGGESTION = "UPDATE_SUGGESTION";
export declare const UPDATE_RESULTS = "UPDATE_RESULTS";
export declare const SELECT_SUGGESTION = "SELECT_SUGGESTION";
export declare const variableTrigger: RegExp;
export declare enum SuggestionKind {
    'emoji' = "emoji",
    'link' = "link",
    'command' = "command",
    'variable' = "variable",
    'display' = "display",
    'mention' = "mention"
}
export interface EmojiResult {
    c: string;
    n: string;
    s: string;
    o: string;
}
export declare type LinkResult = {
    kind: ReferenceKind;
    uid: string;
    title: string | null;
    label: string | null;
    content: string;
    linkKind?: string;
};
export declare type VariableResult = Partial<types.Variable>;
export type { CommandResult };
export declare type SuggestionResult = EmojiResult | CommandResult | VariableResult | LinkResult;
export declare type Location = {
    left: number;
    right: number;
    top: number;
    bottom: number;
} | DOMRect;
export declare type Range = {
    from: number;
    to: number;
};
export declare type SuggestionState = {
    view: EditorView | null;
    open: boolean;
    trigger: string;
    kind: SuggestionKind | null;
    search: string | null;
    range: Range;
    selected: number;
    results: SuggestionResult[];
};
export interface UpdateSuggestionAction {
    type: typeof UPDATE_SUGGESTION;
    payload: {
        open: boolean;
        view: EditorView | null;
        kind: SuggestionKind | null;
        range: Range;
        search: string | null;
        trigger: string;
    };
}
export interface UpdateSuggestionResultsAction {
    type: typeof UPDATE_RESULTS;
    payload: {
        results: any[];
    };
}
export interface UpdateSuggestionSelectionAction {
    type: typeof SELECT_SUGGESTION;
    payload: {
        selection: number;
    };
}
export declare type SuggestionActionTypes = UpdateSuggestionAction | UpdateSuggestionResultsAction | UpdateSuggestionSelectionAction;
