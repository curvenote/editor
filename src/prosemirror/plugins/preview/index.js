import React from 'react';
import { render } from 'react-dom';
import { Plugin } from 'prosemirror-state';
import schema from '../../schema';
import PreviewEditor from './PreviewEditor';
import { isEditable } from '../editable';
import { getNodeIfSelected } from '../../utils';
var PreviewTooltip = (function () {
    function PreviewTooltip(view) {
        var _this = this;
        var _a;
        this.tooltip = null;
        this.view = view;
        this.dom = document.createElement('div');
        this.dom.style.position = 'absolute';
        this.dom.style.zIndex = '2';
        (_a = view.dom.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.dom);
        render(React.createElement(PreviewEditor, { ref: function (r) { _this.tooltip = r; } }), this.dom);
        this.update(view, null);
    }
    PreviewTooltip.prototype.update = function (view, lastState) {
        var _a, _b, _c, _d;
        var state = view.state;
        if (lastState && lastState.doc.eq(state.doc) && lastState.selection.eq(state.selection))
            return;
        var node = getNodeIfSelected(state, schema.nodes.cite);
        if (!node) {
            (_a = this.tooltip) === null || _a === void 0 ? void 0 : _a.setState({ open: false });
            return;
        }
        var _e = state.selection, from = _e.from, to = _e.to;
        var start = view.coordsAtPos(from);
        var end = view.coordsAtPos(to);
        var box = (_c = (_b = this.dom.offsetParent) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect()) !== null && _c !== void 0 ? _c : { left: 0, top: 0 };
        var top = Math.max(start.bottom, end.bottom);
        var left = Math.min(start.left, end.left);
        this.dom.style.top = top - box.top + 10 + "px";
        this.dom.style.left = left - box.left + "px";
        var viewId = view.dom.id;
        (_d = this.tooltip) === null || _d === void 0 ? void 0 : _d.setState({
            viewId: viewId,
            open: true,
            edit: isEditable(state),
            uid: node.attrs.key,
        });
    };
    PreviewTooltip.prototype.destroy = function () { this.dom.remove(); };
    return PreviewTooltip;
}());
var previewPlugin = new Plugin({
    view: function (editorView) { return new PreviewTooltip(editorView); },
});
export default previewPlugin;
//# sourceMappingURL=index.js.map