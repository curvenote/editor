var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import runtime from '@curvenote/runtime';
import thunkMiddleware from 'redux-thunk';
import { middleware } from '../src';
export default __spreadArray(__spreadArray([
    thunkMiddleware
], middleware, true), [
    runtime.triggerEvaluate,
    runtime.dangerousEvaluatation,
], false);
//# sourceMappingURL=middleware.js.map