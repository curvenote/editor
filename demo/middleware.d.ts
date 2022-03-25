declare const _default: ((import("redux-thunk").ThunkMiddleware<any, import("redux").AnyAction, undefined> & {
    withExtraArgument<ExtraThunkArg, State = any, BasicAction extends import("redux").Action<any> = import("redux").AnyAction>(extraArgument: ExtraThunkArg): import("redux-thunk").ThunkMiddleware<State, BasicAction, ExtraThunkArg>;
}) | import("../src").Middleware)[];
export default _default;
