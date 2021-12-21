import { isEditable } from '../prosemirror/plugins/editable';
import { clickSelectFigure } from './utils';
var ImageNodeView = (function () {
    function ImageNodeView(node, view, getPos) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        var _a = node.attrs, src = _a.src, title = _a.title, alt = _a.alt, width = _a.width;
        this.dom = document.createElement('img');
        this.dom.addEventListener('mousedown', function () { return clickSelectFigure(view, getPos); });
        this.dom.addEventListener('click', function () { return clickSelectFigure(view, getPos); });
        this.dom.src = src;
        this.dom.alt = alt !== null && alt !== void 0 ? alt : '';
        this.dom.title = title !== null && title !== void 0 ? title : '';
        this.dom.style.width = "".concat(width, "%");
    }
    ImageNodeView.prototype.selectNode = function () {
        if (!isEditable(this.view.state))
            return;
        this.dom.classList.add('ProseMirror-selectednode');
    };
    ImageNodeView.prototype.deselectNode = function () {
        this.dom.classList.remove('ProseMirror-selectednode');
    };
    return ImageNodeView;
}());
export function ImageView(node, view, getPos) {
    return new ImageNodeView(node, view, getPos);
}
//# sourceMappingURL=ImageView.js.map