import { State, SuggestionResult } from '../types';
export declare const selectSuggestionState: (state: State) => import("./types").SuggestionState;
export declare const selectSuggestionKind: (state: State) => import("./types").SuggestionKind | null;
export declare const selecteSelectedSuggestion: (state: State) => number;
export declare const isSuggestionSelected: (state: State, index: number) => boolean;
export declare const isSuggestionOpen: (state: State) => boolean;
export declare function getSuggestionResults<T = SuggestionResult>(state: State): T[];
export declare function selectSuggestionView(state: State): import("prosemirror-view").EditorView | null;
