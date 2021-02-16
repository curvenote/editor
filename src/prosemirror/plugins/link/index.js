import React from 'react';
import { render } from 'react-dom';
import { Plugin } from 'prosemirror-state';
import schema from '../../schema';
import LinkEditor from './LinkEditor';
import { isEditable } from '../editable';
import { getLinkBoundsIfTheyExist } from '../../utils';
var LinkViewTooltip = (function () {
    function LinkViewTooltip(view) {
        var _this = this;
        var _a;
        this.tooltip = null;
        this.view = view;
        this.dom = document.createElement('div');
        this.dom.style.position = 'absolute';
        this.dom.style.zIndex = '2';
        (_a = view.dom.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.dom);
        render(React.createElement(LinkEditor, { ref: function (r) { _this.tooltip = r; } }), this.dom);
        this.update(view, null);
    }
    LinkViewTooltip.prototype.update = function (view, lastState) {
        var _this = this;
        var _a, _b, _c, _d;
        var state = view.state;
        if (lastState && lastState.doc.eq(state.doc) && lastState.selection.eq(state.selection))
            return;
        var linkBounds = getLinkBoundsIfTheyExist(state);
        if (!linkBounds) {
            (_a = this.tooltip) === null || _a === void 0 ? void 0 : _a.setState({ open: false });
            return;
        }
        var start = view.coordsAtPos(linkBounds.from);
        var end = view.coordsAtPos(linkBounds.to);
        var box = (_c = (_b = this.dom.offsetParent) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect()) !== null && _c !== void 0 ? _c : { left: 0, top: 0 };
        var top = Math.max(start.bottom, end.bottom);
        var left = Math.min(start.left, end.left);
        this.dom.style.top = top - box.top + 10 + "px";
        this.dom.style.left = left - box.left + "px";
        var viewId = view.dom.id;
        var href = linkBounds.link.attrs.href;
        var mark = schema.marks.link;
        var onDelete = function () { return (_this.view.dispatch(state.tr.removeMark(linkBounds.from, linkBounds.to, mark))); };
        var onEdit = function () {
            var newHref = prompt('What is the new link?', href);
            if (!newHref)
                return;
            var link = mark.create({ href: newHref });
            var tr = state.tr
                .removeMark(linkBounds.from, linkBounds.to, mark)
                .addMark(linkBounds.from, linkBounds.to, link);
            _this.view.dispatch(tr);
        };
        (_d = this.tooltip) === null || _d === void 0 ? void 0 : _d.setState({
            viewId: viewId,
            open: true, edit: isEditable(state),
            href: href, onEdit: onEdit, onDelete: onDelete,
        });
    };
    LinkViewTooltip.prototype.destroy = function () { this.dom.remove(); };
    return LinkViewTooltip;
}());
var linkViewPlugin = new Plugin({
    view: function (editorView) { return new LinkViewTooltip(editorView); },
});
export default linkViewPlugin;
//# sourceMappingURL=index.js.map