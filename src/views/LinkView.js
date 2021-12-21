var LinkNodeView = (function () {
    function LinkNodeView(node, view, getPos) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('a');
        var _a = node.attrs, href = _a.href, title = _a.title;
        this.dom.setAttribute('href', href);
        this.dom.setAttribute('title', title || href);
        this.dom.setAttribute('target', '_blank');
        this.dom.setAttribute('rel', 'noopener noreferrer');
    }
    return LinkNodeView;
}());
export function LinkView(node, view, getPos) {
    return new LinkNodeView(node, view, getPos);
}
//# sourceMappingURL=LinkView.js.map