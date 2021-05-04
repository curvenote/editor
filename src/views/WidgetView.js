import { openAttributeEditor } from '../store/attrs/actions';
import { store } from '../connect';
var WidgetView = (function () {
    function WidgetView(node, view, getPos) {
        var _this = this;
        var _a, _b, _c, _d;
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.dom = document.createElement('div');
        this.dom.classList.add('widget', "widget-" + node.type.name);
        this.dom.addEventListener('contextmenu', function (event) {
            store.dispatch(openAttributeEditor(true, (getPos === null || getPos === void 0 ? void 0 : getPos()) || 0, _this.dom));
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
        }, true);
        var widgetTag = (_d = (_c = (_b = (_a = node.type.spec).toDOM) === null || _b === void 0 ? void 0 : _b.call(_a, node)) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : 'span';
        this.widget = document.createElement(widgetTag);
        this.setAttrs(node);
        this.dom.append(this.widget);
    }
    WidgetView.prototype.selectNode = function () {
        this.widget.classList.add('ProseMirror-selectednode');
    };
    WidgetView.prototype.deselectNode = function () {
        this.widget.classList.remove('ProseMirror-selectednode');
    };
    WidgetView.prototype.update = function (node) {
        this.setAttrs(node);
        return true;
    };
    WidgetView.prototype.setAttrs = function (node) {
        var _this = this;
        var _a, _b, _c, _d;
        var attrs = (_d = (_c = (_b = (_a = node.type.spec).toDOM) === null || _b === void 0 ? void 0 : _b.call(_a, node)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : {};
        Object.entries(attrs).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            _this.widget.setAttribute(key, value);
        });
    };
    return WidgetView;
}());
export var newWidgetView = function (node, view, getPos) { return (new WidgetView(node, view, getPos)); };
export default WidgetView;
//# sourceMappingURL=WidgetView.js.map