export function positionPopper(anchorEl) {
    if ((anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.isConnected) || anchorEl == null) {
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
    }
}
//# sourceMappingURL=utils.js.map