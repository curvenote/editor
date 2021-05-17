import { v4 as uuid } from 'uuid';
export function positionPopper(anchorEl) {
    if (anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.isConnected) {
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
    }
}
export var newLabel = function (prepend) { return prepend + "-" + uuid().split('-')[0]; };
//# sourceMappingURL=utils.js.map