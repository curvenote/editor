import { formatDatetime } from '@curvenote/schema';
var TimeNodeView = (function () {
    function TimeNodeView(node, view, getPos) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('time');
        this.setDate();
    }
    TimeNodeView.prototype.update = function (node) {
        this.node = node;
        this.setDate();
        return true;
    };
    TimeNodeView.prototype.setDate = function () {
        var datetime = this.node.attrs.datetime;
        this.dom.setAttribute('datetime', datetime);
        var f = formatDatetime(datetime).f;
        this.dom.textContent = f;
    };
    return TimeNodeView;
}());
export function TimeView(node, view, getPos) {
    return new TimeNodeView(node, view, getPos);
}
//# sourceMappingURL=TimeView.js.map