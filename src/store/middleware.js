var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import stateMiddleware from './state/middleware';
import uiMiddleware from './ui/middleware';
var middleware = __spreadArray(__spreadArray([], stateMiddleware), uiMiddleware);
export default middleware;
//# sourceMappingURL=middleware.js.map