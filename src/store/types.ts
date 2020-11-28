import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  Store as RStore, Action, Middleware as RMiddleware, Reducer as RReducer,
} from 'redux';
import { ProsemirrorState, ProsemirrorActionTypes } from './state/types';
import { UIState, UIActionTypes } from './ui/types';

export interface State {
  prosemirror: {
    state: ProsemirrorState;
    ui: UIState;
  };
}

export type PROSEMIRROR_ACTIONS = (
  ProsemirrorActionTypes |
  UIActionTypes
);

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, null, Action<string>>;
export type Dispatch = ThunkDispatch<State, null, Action<string>>;
export type Store = RStore<State, PROSEMIRROR_ACTIONS> & { dispatch: Dispatch };
export type Middleware = RMiddleware<{}, State, Dispatch>;
export type Reducer = RReducer<State, PROSEMIRROR_ACTIONS>;
