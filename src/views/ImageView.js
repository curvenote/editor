import { isEditable } from '../prosemirror/plugins/editable';
var ImageView = (function () {
    function ImageView(node, view, getPos) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('div');
        var _a = node.attrs, align = _a.align, src = _a.src, title = _a.title, alt = _a.alt, width = _a.width;
        this.dom.style.textAlign = align;
        this.dom.style.margin = '1.5em 0';
        this.img = document.createElement('img');
        this.img.src = src;
        this.img.alt = alt !== null && alt !== void 0 ? alt : '';
        this.img.title = title !== null && title !== void 0 ? title : '';
        this.img.style.width = width + "%";
        this.dom.appendChild(this.img);
    }
    ImageView.prototype.selectNode = function () {
        if (!isEditable(this.view.state))
            return;
        this.img.classList.add('ProseMirror-selectednode');
    };
    ImageView.prototype.deselectNode = function () {
        this.img.classList.remove('ProseMirror-selectednode');
    };
    return ImageView;
}());
export default ImageView;
//# sourceMappingURL=ImageView.js.map