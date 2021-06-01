var CiteView = (function () {
    function CiteView(node, view, getPos) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('cite');
        var _a = node.attrs, title = _a.title, inline = _a.inline;
        this.dom.setAttribute('title', title);
        this.dom.textContent = inline;
    }
    return CiteView;
}());
export default CiteView;
//# sourceMappingURL=CiteView.js.map