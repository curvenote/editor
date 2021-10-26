var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { chainCommands } from 'prosemirror-commands';
export function createBind() {
    var keys = {};
    var bind = function (key) {
        var cmds = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            cmds[_i - 1] = arguments[_i];
        }
        keys[key] = keys[key] ? __spreadArray(__spreadArray([], keys[key], true), cmds, true) : __spreadArray([], cmds, true);
    };
    return { keys: keys, bind: bind };
}
export function flattenCommandList(keys) {
    return Object.fromEntries(Object.entries(keys).map(function (_a) {
        var o = _a[0], k = _a[1];
        if (k.length === 1)
            return [o, k[0]];
        return [o, chainCommands.apply(void 0, k)];
    }));
}
//# sourceMappingURL=utils.js.map