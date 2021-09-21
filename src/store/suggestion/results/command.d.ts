import { EditorView } from 'prosemirror-view';
import { AppThunk } from '../../types';
import { CommandResult, CommandNames } from '../commands';
export declare const startingSuggestions: (view: EditorView) => CommandResult[];
export declare function executeCommand(command: CommandNames, viewOrId: EditorView | string | null, removeText?: () => boolean, replace?: boolean): AppThunk<Promise<boolean>>;
export declare function chooseSelection(result: CommandResult): AppThunk<Promise<boolean>>;
export declare function filterResults(view: EditorView, search: string, callback: (results: CommandResult[]) => void): void;
