import type { ThunkAction, ThunkDispatch } from 'redux-thunk';
import type {
  Store as RStore,
  Action,
  Middleware as RMiddleware,
  Reducer as RReducer,
} from 'redux';
import type { types as runtimeTypes } from '@curvenote/runtime';
import type { State as SidenotesState } from 'sidenotes';
import type { EditorsState, EditorActionTypes } from './state/types';
import type { UIState, UIActionTypes } from './ui/types';
import { SelectionKinds } from './ui/types';
import type {
  SuggestionState,
  SuggestionActionTypes,
  SuggestionResult,
  EmojiResult,
  CommandResult,
  VariableResult,
  LinkResult,
} from './suggestion/types';
import { SuggestionKind } from './suggestion/types';
import type { AttributesState, AttributesActionTypes } from './attrs/types';

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

export type EditorActions =
  | EditorActionTypes
  | UIActionTypes
  | SuggestionActionTypes
  | AttributesActionTypes;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, null, Action<string>>;
export type Dispatch = ThunkDispatch<State, null, Action<string>>;
export type Store = RStore<State, EditorActions> & { dispatch: Dispatch };
export type Middleware = RMiddleware<Record<string, any>, State, Dispatch>;
export type Reducer = RReducer<State, EditorActions>;

export { SuggestionKind, SelectionKinds };

export * from './state/types';

export type { SuggestionResult, EmojiResult, CommandResult, VariableResult, LinkResult };
