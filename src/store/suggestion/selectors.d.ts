import { State, SuggestionResult } from '../types';
export declare const getSuggestion: (state: State) => import("./types").SuggestionState;
export declare const isSuggestionSelected: (state: State, index: number) => boolean;
export declare const isSuggestionOpen: (state: State) => boolean;
export declare function getSuggestionResults<T = SuggestionResult>(state: State): T[];
