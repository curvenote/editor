import { Schema } from 'prosemirror-model';
import { AppThunk, State, Dispatch } from '../../types';
import { VariableResult, SuggestionKind } from '../types';
import { KEEP_SELECTION_ALIVE } from '../../../prosemirror/plugins/suggestion';
declare type VarSuggestionKinds = SuggestionKind.variable | SuggestionKind.display;
export declare const startingSuggestions: (kind: VarSuggestionKinds, getState: () => State) => Partial<import("@curvenote/runtime/dist/store/types").Variable>[];
export declare function chooseSelection(kind: VarSuggestionKinds, result: VariableResult): AppThunk<boolean | typeof KEEP_SELECTION_ALIVE>;
export declare function filterResults(kind: VarSuggestionKinds, schema: Schema, search: string, dispatch: Dispatch, getState: () => State, callback: (results: VariableResult[]) => void): void;
export {};
