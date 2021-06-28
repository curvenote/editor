var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import runtime from '@curvenote/runtime';
import thunkMiddleware from 'redux-thunk';
import { middleware } from '../src';
export default __spreadArray(__spreadArray([
    thunkMiddleware
], middleware), [
    runtime.triggerEvaluate,
    runtime.dangerousEvaluatation,
]);
//# sourceMappingURL=middleware.js.map