import React from 'react';
import { render } from 'react-dom';
import { Plugin } from 'prosemirror-state';
import { findParentNode, isNodeSelection } from 'prosemirror-utils';
import schema from '../../schema';
import Wrapper from './Wrapper';
import { isEditable } from '../editable';
import { getLinkBoundsIfTheyExist } from '../../../store/actions/utils';
import { SelectionKinds } from './types';
var InlineActions = (function () {
    function InlineActions(view) {
        var _this = this;
        var _a;
        this.wrapper = null;
        this.view = view;
        this.dom = document.createElement('div');
        (_a = view.dom.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(this.dom);
        render(React.createElement(Wrapper, { view: view, ref: function (r) { _this.wrapper = r; } }), this.dom);
        this.update(view);
    }
    InlineActions.prototype.update = function (view) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var state = view.state;
        var edit = isEditable(state);
        var linkBounds = getLinkBoundsIfTheyExist(state);
        if (linkBounds) {
            var anchorEl = (_a = view.nodeDOM(linkBounds.from)) === null || _a === void 0 ? void 0 : _a.parentElement;
            (_b = this.wrapper) === null || _b === void 0 ? void 0 : _b.setState({
                open: true,
                edit: edit,
                kind: SelectionKinds.link, placement: 'bottom-start',
                anchorEl: anchorEl,
            });
            return;
        }
        var node = (isNodeSelection(state.selection)
            ? state.selection : { node: null }).node;
        switch (node === null || node === void 0 ? void 0 : node.type.name) {
            case schema.nodes.image.name: {
                var wrapper = view.nodeDOM(state.selection.from);
                var anchorEl = (_c = wrapper === null || wrapper === void 0 ? void 0 : wrapper.getElementsByTagName('img')[0]) !== null && _c !== void 0 ? _c : wrapper;
                (_d = this.wrapper) === null || _d === void 0 ? void 0 : _d.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.image, placement: 'bottom',
                    anchorEl: anchorEl,
                });
                return;
            }
            case schema.nodes.iframe.name: {
                var wrapper = view.nodeDOM(state.selection.from);
                var anchorEl = (_e = wrapper === null || wrapper === void 0 ? void 0 : wrapper.getElementsByTagName('iframe')[0]) !== null && _e !== void 0 ? _e : wrapper;
                (_f = this.wrapper) === null || _f === void 0 ? void 0 : _f.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.iframe, placement: 'bottom',
                    anchorEl: anchorEl,
                });
                return;
            }
            case schema.nodes.math.name: {
                var anchorEl = view.nodeDOM(state.selection.from);
                (_g = this.wrapper) === null || _g === void 0 ? void 0 : _g.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.math, placement: 'bottom-start',
                    anchorEl: anchorEl,
                });
                return;
            }
            case schema.nodes.equation.name: {
                var anchorEl = view.nodeDOM(state.selection.from);
                (_h = this.wrapper) === null || _h === void 0 ? void 0 : _h.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.equation, placement: 'bottom',
                    anchorEl: anchorEl,
                });
                return;
            }
            case schema.nodes.cite.name: {
                var anchorEl = view.nodeDOM(state.selection.from);
                (_j = this.wrapper) === null || _j === void 0 ? void 0 : _j.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.cite, placement: 'bottom-start',
                    anchorEl: anchorEl,
                });
                return;
            }
            default:
                break;
        }
        var parent = findParentNode(function (n) { return n.type === schema.nodes.callout; })(state.selection);
        if (parent || (node === null || node === void 0 ? void 0 : node.type) === schema.nodes.callout) {
            var anchorEl = view.nodeDOM((_k = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _k !== void 0 ? _k : state.selection.from);
            (_l = this.wrapper) === null || _l === void 0 ? void 0 : _l.setState({
                open: true,
                edit: edit,
                kind: SelectionKinds.callout, placement: 'bottom',
                anchorEl: anchorEl,
            });
            return;
        }
        (_m = this.wrapper) === null || _m === void 0 ? void 0 : _m.setState({ open: false, edit: edit });
    };
    InlineActions.prototype.destroy = function () { this.dom.remove(); };
    return InlineActions;
}());
var inlineActionsPlugin = new Plugin({
    view: function (editorView) { return new InlineActions(editorView); },
});
export default inlineActionsPlugin;
//# sourceMappingURL=index.js.map