import { UIState, UIActionTypes } from './types';
export declare const initialState: UIState;
declare const uiReducer: (state: UIState | undefined, action: UIActionTypes) => UIState;
export default uiReducer;
