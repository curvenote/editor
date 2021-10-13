var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { StepMap } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { chainCommands, deleteSelection, newlineInCode } from 'prosemirror-commands';
import { isEditable } from '../prosemirror/plugins/editable';
import { getInlinePlugins } from '../prosemirror/plugins';
import MathView from './MathView';
var FootnoteView = (function () {
    function FootnoteView(node, view, getPos) {
        var _this = this;
        this.node = node;
        this.outerView = view;
        this.getPos = getPos;
        this.dom = document.createElement('span');
        this.dom.classList.add('footnote');
        this.editor = document.createElement('span');
        this.editor.classList.add('tooltip');
        this.dom.addEventListener('click', function () { return _this.selectNode(); });
        this.dom.addEventListener('mouseenter', function () { return _this.positionTooltip(); });
        this.dom.appendChild(this.editor);
        var unfocus = function () {
            _this.dom.classList.remove('open');
            _this.outerView.focus();
            return true;
        };
        var mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
        this.innerView = new EditorView({
            mount: this.editor,
        }, {
            editable: function () { return isEditable(view.state); },
            state: EditorState.create({
                doc: this.node,
                plugins: __spreadArray(__spreadArray([], getInlinePlugins(this.outerView.state.schema), true), [
                    keymap(__assign(__assign({ 'Mod-a': function () {
                            var _a = _this.innerView.state, doc = _a.doc, tr = _a.tr;
                            var sel = TextSelection.create(doc, 0, _this.node.nodeSize - 2);
                            _this.innerView.dispatch(tr.setSelection(sel));
                            return true;
                        }, 'Mod-z': function () { return undo(_this.outerView.state, _this.outerView.dispatch); }, 'Mod-Z': function () { return redo(_this.outerView.state, _this.outerView.dispatch); } }, (mac
                        ? {}
                        : { 'Mod-y': function () { return redo(_this.outerView.state, _this.outerView.dispatch); } })), { Escape: unfocus, Tab: unfocus, 'Shift-Tab': unfocus, Enter: unfocus, 'Ctrl-Enter': chainCommands(newlineInCode, unfocus), Backspace: chainCommands(deleteSelection, function (state) {
                            if (!state.selection.empty) {
                                return false;
                            }
                            if (_this.node.textContent.length > 0) {
                                return false;
                            }
                            _this.outerView.dispatch(_this.outerView.state.tr.insertText(''));
                            _this.outerView.focus();
                            return true;
                        }) })),
                ], false),
            }),
            dispatchTransaction: this.dispatchInner.bind(this),
            handleDOMEvents: {
                mousedown: function () {
                    if (_this.outerView.hasFocus())
                        _this.innerView.focus();
                    return false;
                },
            },
            nodeViews: {
                math: function (n, v, gP) {
                    return new MathView(n, v, gP, true);
                },
            },
        });
    }
    FootnoteView.prototype.positionTooltip = function () {
        var _a = this.dom, offsetTop = _a.offsetTop, offsetHeight = _a.offsetHeight;
        this.editor.style.top = offsetTop + offsetHeight + 8 + "px";
    };
    FootnoteView.prototype.selectNode = function () {
        var _this = this;
        this.dom.classList.add('ProseMirror-selectednode');
        this.dom.classList.add('open');
        if (isEditable(this.outerView.state)) {
            this.positionTooltip();
            setTimeout(function () { return _this.innerView.focus(); }, 0);
        }
    };
    FootnoteView.prototype.deselectNode = function () {
        this.dom.classList.remove('ProseMirror-selectednode');
        this.dom.classList.remove('open');
    };
    FootnoteView.prototype.dispatchInner = function (tr) {
        var _a = this.innerView.state.applyTransaction(tr), state = _a.state, transactions = _a.transactions;
        this.innerView.updateState(state);
        if (!tr.getMeta('fromOutside')) {
            var outerTr = this.outerView.state.tr;
            var offsetMap = StepMap.offset(this.getPos() + 1);
            for (var i = 0; i < transactions.length; i += 1) {
                var steps = transactions[i].steps;
                for (var j = 0; j < steps.length; j += 1)
                    outerTr.step(steps[j].map(offsetMap));
            }
            if (outerTr.docChanged)
                this.outerView.dispatch(outerTr);
        }
    };
    FootnoteView.prototype.update = function (node) {
        if (!node.sameMarkup(this.node))
            return false;
        this.node = node;
        if (this.innerView) {
            var state = this.innerView.state;
            var start = node.content.findDiffStart(state.doc.content);
            if (start != null) {
                var ends = node.content.findDiffEnd(state.doc.content);
                var _a = ends !== null && ends !== void 0 ? ends : { a: 0, b: 0 }, endA = _a.a, endB = _a.b;
                var overlap = start - Math.min(endA, endB);
                if (overlap > 0) {
                    endA += overlap;
                    endB += overlap;
                }
                this.innerView.dispatch(state.tr.replace(start, endB, node.slice(start, endA)).setMeta('fromOutside', true));
            }
        }
        return true;
    };
    FootnoteView.prototype.destroy = function () {
        this.innerView.destroy();
        this.dom.textContent = '';
    };
    FootnoteView.prototype.stopEvent = function (event) {
        var _a;
        return (_a = (this.innerView && this.innerView.dom.contains(event.target))) !== null && _a !== void 0 ? _a : false;
    };
    FootnoteView.prototype.ignoreMutation = function () {
        return true;
    };
    return FootnoteView;
}());
export default FootnoteView;
//# sourceMappingURL=FootnoteView.js.map