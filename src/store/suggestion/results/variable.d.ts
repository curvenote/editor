import { Schema } from 'prosemirror-model';
import { KEEP_OPEN } from 'prosemirror-autocomplete';
import { AppThunk, State, Dispatch } from '../../types';
import { VariableResult, SuggestionKind } from '../types';
declare type VarSuggestionKinds = SuggestionKind.variable | SuggestionKind.display;
export declare const startingSuggestions: (kind: VarSuggestionKinds, getState: () => State) => Partial<import("@curvenote/runtime/dist/store/types").Variable>[];
export declare function chooseSelection(kind: VarSuggestionKinds, result: VariableResult): AppThunk<boolean | typeof KEEP_OPEN>;
export declare function filterResults(kind: VarSuggestionKinds, schema: Schema, search: string, dispatch: Dispatch, getState: () => State, callback: (results: VariableResult[]) => void): void;
export {};
