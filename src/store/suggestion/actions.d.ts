import { EditorView } from 'prosemirror-view';
import { SuggestionActionTypes, SuggestionKind, Range } from './types';
import { SuggestionAction, KEEP_SELECTION_ALIVE } from '../../prosemirror/plugins/suggestion';
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
export declare function chooseSelection(selected: number): AppThunk<boolean | typeof KEEP_SELECTION_ALIVE>;
export declare function filterResults(view: EditorView, search: string): AppThunk<void>;
export declare function handleSuggestion(action: SuggestionAction): AppThunk<boolean | typeof KEEP_SELECTION_ALIVE>;
