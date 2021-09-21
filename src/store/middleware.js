var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import stateMiddleware from './state/middleware';
import uiMiddleware from './ui/middleware';
var middleware = __spreadArray(__spreadArray([], stateMiddleware, true), uiMiddleware, true);
export default middleware;
//# sourceMappingURL=middleware.js.map