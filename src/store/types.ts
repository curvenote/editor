import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  Store as RStore, Action, Middleware as RMiddleware, Reducer as RReducer,
} from 'redux';
import { types as runtimeTypes } from '@iooxa/runtime';
import { ProsemirrorState, ProsemirrorActionTypes } from './state/types';
import { UIState, UIActionTypes } from './ui/types';
import { SuggestionState, SuggestionActionTypes } from './suggestion/types';
import { AttributesState, AttributesActionTypes } from './attrs/types';

export interface State {
  prosemirror: {
    state: ProsemirrorState;
    ui: UIState;
    suggestion: SuggestionState;
    attrs: AttributesState;
  };
  runtime: runtimeTypes.State['runtime'];
}

export type PROSEMIRROR_ACTIONS = (
  ProsemirrorActionTypes |
  UIActionTypes |
  SuggestionActionTypes |
  AttributesActionTypes
);

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, null, Action<string>>;
export type Dispatch = ThunkDispatch<State, null, Action<string>>;
export type Store = RStore<State, PROSEMIRROR_ACTIONS> & { dispatch: Dispatch };
export type Middleware = RMiddleware<{}, State, Dispatch>;
export type Reducer = RReducer<State, PROSEMIRROR_ACTIONS>;
