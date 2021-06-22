import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Store as RStore, Action, Middleware as RMiddleware, Reducer as RReducer } from 'redux';
import { types as runtimeTypes } from '@curvenote/runtime';
import { State as SidenotesState } from 'sidenotes';
import { EditorsState, EditorActionTypes } from './state/types';
import { UIState, UIActionTypes, SelectionKinds } from './ui/types';
import { SuggestionState, SuggestionActionTypes, SuggestionKind, SuggestionResult, EmojiResult, CommandResult, VariableResult, LinkResult } from './suggestion/types';
import { AttributesState, AttributesActionTypes } from './attrs/types';
export interface State {
    editor: {
        state: EditorsState;
        ui: UIState;
        suggestion: SuggestionState;
        attrs: AttributesState;
    };
    runtime: runtimeTypes.State['runtime'];
    sidenotes: SidenotesState['sidenotes'];
}
export declare type EditorActions = EditorActionTypes | UIActionTypes | SuggestionActionTypes | AttributesActionTypes;
export declare type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, null, Action<string>>;
export declare type Dispatch = ThunkDispatch<State, null, Action<string>>;
export declare type Store = RStore<State, EditorActions> & {
    dispatch: Dispatch;
};
export declare type Middleware = RMiddleware<Record<string, any>, State, Dispatch>;
export declare type Reducer = RReducer<State, EditorActions>;
export { SuggestionKind, SelectionKinds };
export * from './state/types';
export type { SuggestionResult, EmojiResult, CommandResult, VariableResult, LinkResult };
