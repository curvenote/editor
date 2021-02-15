import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  Store as RStore, Action, Middleware as RMiddleware, Reducer as RReducer,
} from 'redux';
import { types as runtimeTypes } from '@curvenote/runtime';
import { State as SidenotesState } from 'sidenotes';
import { EditorsState, EditorActionTypes } from './state/types';
import { UIState, UIActionTypes } from './ui/types';
import { SuggestionState, SuggestionActionTypes } from './suggestion/types';
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

export type EditorActions = (
  EditorActionTypes |
  UIActionTypes |
  SuggestionActionTypes |
  AttributesActionTypes
);

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, null, Action<string>>;
export type Dispatch = ThunkDispatch<State, null, Action<string>>;
export type Store = RStore<State, EditorActions> & { dispatch: Dispatch };
export type Middleware = RMiddleware<Record<string, any>, State, Dispatch>;
export type Reducer = RReducer<State, EditorActions>;
