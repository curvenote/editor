var popper = null;
export function registerPopper(next) {
    popper = next;
}
export function positionPopper() {
    popper === null || popper === void 0 ? void 0 : popper.update();
}
//# sourceMappingURL=utils.js.map