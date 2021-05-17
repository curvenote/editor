import { InlineSelection, UIActionTypes } from './types';
import { AppThunk } from '../types';
export declare function selectEditorView(viewId: string | null): AppThunk<void>;
export declare function focusEditorView(viewId: string | null, focused: boolean): AppThunk<void>;
export declare function focusSelectedEditorView(focused: boolean): AppThunk<void>;
export declare function setInlineSelection(selection: InlineSelection | null): UIActionTypes;
export declare function positionInlineActions(): AppThunk<void>;
