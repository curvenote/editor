var MentionNodeView = (function () {
    function MentionNodeView(node, view, getPos) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('span');
        this.dom.classList.add('mention');
        this.setData();
    }
    MentionNodeView.prototype.update = function (node) {
        this.node = node;
        this.setData();
        return true;
    };
    MentionNodeView.prototype.setData = function () {
        var label = this.node.attrs.label;
        this.dom.innerText = label;
    };
    return MentionNodeView;
}());
export function MentionView(node, view, getPos) {
    return new MentionNodeView(node, view, getPos);
}
//# sourceMappingURL=Mention.js.map