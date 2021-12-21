import { KEEP_OPEN, AutocompleteAction } from 'prosemirror-autocomplete';
import { EditorView } from 'prosemirror-view';
import { SuggestionActionTypes, SuggestionKind, Range } from './types';
import { AppThunk } from '../types';
export { executeCommand } from './results/command';
export declare function updateSuggestion(open: boolean, kind: SuggestionKind, search: string | null, view: EditorView, range: Range, trigger: string): SuggestionActionTypes;
export declare function closeSuggestion(): {
    type: string;
    payload: {
        open: boolean;
    };
};
export declare function updateResults(results: any[]): SuggestionActionTypes;
export declare function selectSuggestion(selection: number): SuggestionActionTypes;
export declare function chooseSelection(selected: number): AppThunk<boolean | typeof KEEP_OPEN>;
export declare function filterResults(view: EditorView, search: string): AppThunk<void>;
export declare function handleSuggestion(action: AutocompleteAction): AppThunk<boolean | typeof KEEP_OPEN>;
