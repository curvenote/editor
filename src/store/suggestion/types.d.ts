import { types } from '@curvenote/runtime';
import { EditorView } from 'prosemirror-view';
import { CitationFormat } from '../../types';
import { CommandResult } from './commands';
export declare const UPDATE_SUGGESTION = "UPDATE_SUGGESTION";
export declare const UPDATE_RESULTS = "UPDATE_RESULTS";
export declare const SELECT_SUGGESTION = "SELECT_SUGGESTION";
export declare const variableTrigger: RegExp;
export declare enum SuggestionKind {
    'emoji' = 0,
    'person' = 1,
    'link' = 2,
    'command' = 3,
    'variable' = 4,
    'display' = 5
}
export interface EmojiResult {
    c: string;
    n: string;
    s: string;
    o: string;
}
export declare type LinkResult = CitationFormat;
export declare type VariableResult = Partial<types.Variable>;
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
    location: Location | null;
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
        location: Location | null;
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
export declare type SuggestionActionTypes = (UpdateSuggestionAction | UpdateSuggestionResultsAction | UpdateSuggestionSelectionAction);
