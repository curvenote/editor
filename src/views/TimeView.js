import { formatDatetime } from '@curvenote/schema/dist/nodes/time';
var TimeView = (function () {
    function TimeView(node, view, getPos) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('time');
        this.setDate();
    }
    TimeView.prototype.update = function (node) {
        this.node = node;
        this.setDate();
        return true;
    };
    TimeView.prototype.setDate = function () {
        var datetime = this.node.attrs.datetime;
        this.dom.setAttribute('datetime', datetime);
        var f = formatDatetime(datetime).f;
        this.dom.textContent = f;
    };
    return TimeView;
}());
export default TimeView;
//# sourceMappingURL=TimeView.js.map