import React from 'react';
import { render } from 'react-dom';
import { Plugin } from 'prosemirror-state';
import { findParentNode, isNodeSelection } from 'prosemirror-utils';
import { schemas } from '@curvenote/schema';
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
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
            case schemas.nodes.image.name: {
                var wrapper = view.nodeDOM(state.selection.from);
                var anchorEl = (_d = (_c = wrapper === null || wrapper === void 0 ? void 0 : wrapper.getElementsByTagName) === null || _c === void 0 ? void 0 : _c.call(wrapper, 'img')[0]) !== null && _d !== void 0 ? _d : wrapper;
                (_e = this.wrapper) === null || _e === void 0 ? void 0 : _e.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.image, placement: 'bottom',
                    anchorEl: anchorEl,
                });
                return;
            }
            case schemas.nodes.iframe.name: {
                var wrapper = view.nodeDOM(state.selection.from);
                var anchorEl = (_g = (_f = wrapper === null || wrapper === void 0 ? void 0 : wrapper.getElementsByTagName) === null || _f === void 0 ? void 0 : _f.call(wrapper, 'iframe')[0]) !== null && _g !== void 0 ? _g : wrapper;
                (_h = this.wrapper) === null || _h === void 0 ? void 0 : _h.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.iframe, placement: 'bottom',
                    anchorEl: anchorEl,
                });
                return;
            }
            case schemas.nodes.math.name: {
                var anchorEl = view.nodeDOM(state.selection.from);
                (_j = this.wrapper) === null || _j === void 0 ? void 0 : _j.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.math, placement: 'bottom-start',
                    anchorEl: anchorEl,
                });
                return;
            }
            case schemas.nodes.equation.name: {
                var anchorEl = view.nodeDOM(state.selection.from);
                (_k = this.wrapper) === null || _k === void 0 ? void 0 : _k.setState({
                    open: true,
                    edit: edit,
                    kind: SelectionKinds.equation, placement: 'bottom',
                    anchorEl: anchorEl,
                });
                return;
            }
            case schemas.nodes.cite.name: {
                var anchorEl = view.nodeDOM(state.selection.from);
                (_l = this.wrapper) === null || _l === void 0 ? void 0 : _l.setState({
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
        var parent = findParentNode(function (n) { return n.type === schemas.nodes.callout; })(state.selection);
        if (parent || (node === null || node === void 0 ? void 0 : node.type) === schemas.nodes.callout) {
            var anchorEl = view.nodeDOM((_m = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _m !== void 0 ? _m : state.selection.from);
            (_o = this.wrapper) === null || _o === void 0 ? void 0 : _o.setState({
                open: true,
                edit: edit,
                kind: SelectionKinds.callout, placement: 'bottom',
                anchorEl: anchorEl,
            });
            return;
        }
        (_p = this.wrapper) === null || _p === void 0 ? void 0 : _p.setState({ open: false, edit: edit });
    };
    InlineActions.prototype.destroy = function () { this.dom.remove(); };
    return InlineActions;
}());
var inlineActionsPlugin = new Plugin({
    view: function (editorView) { return new InlineActions(editorView); },
});
export default inlineActionsPlugin;
//# sourceMappingURL=index.js.map