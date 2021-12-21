import { DEFAULT_IMAGE_WIDTH } from '@curvenote/schema';
import { isEditable } from '../prosemirror/plugins/editable';
import { clickSelectFigure } from './utils';
var IFrameNodeView = (function () {
    function IFrameNodeView(node, view, getPos) {
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('div');
        this.dom.addEventListener('mousedown', function () { return clickSelectFigure(view, getPos); });
        this.dom.addEventListener('click', function () { return clickSelectFigure(view, getPos); });
        var _a = node.attrs, src = _a.src, widthIn = _a.width;
        var width = widthIn !== null && widthIn !== void 0 ? widthIn : DEFAULT_IMAGE_WIDTH;
        this.dom.style.margin = '1.5em 0';
        this.div = document.createElement('div');
        this.div.style.position = 'relative';
        this.div.style.display = 'inline-block';
        this.div.style.paddingBottom = "".concat(Math.round((9 / 16) * width), "%");
        this.div.style.width = "".concat(width, "%");
        this.iframe = document.createElement('iframe');
        this.iframe.title = src !== null && src !== void 0 ? src : '';
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        this.iframe.style.position = 'absolute';
        this.iframe.style.top = '0';
        this.iframe.style.left = '0';
        this.iframe.style.border = 'none';
        this.iframe.width = '100%';
        this.iframe.height = '100%';
        this.iframe.src = src;
        this.iframe.allowFullscreen = true;
        this.iframe.allow = 'autoplay';
        this.iframe.src = src;
        this.dom.appendChild(this.div);
        this.div.appendChild(this.iframe);
    }
    IFrameNodeView.prototype.selectNode = function () {
        if (!isEditable(this.view.state))
            return;
        this.div.classList.add('ProseMirror-selectednode');
    };
    IFrameNodeView.prototype.deselectNode = function () {
        this.div.classList.remove('ProseMirror-selectednode');
    };
    return IFrameNodeView;
}());
export function IFrameView(node, view, getPos) {
    return new IFrameNodeView(node, view, getPos);
}
//# sourceMappingURL=IFrameView.js.map