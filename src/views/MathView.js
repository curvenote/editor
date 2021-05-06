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
import { StepMap } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import katex from 'katex';
import { chainCommands, deleteSelection, newlineInCode } from 'prosemirror-commands';
import { isEditable } from '../prosemirror/plugins/editable';
var MathView = (function () {
    function MathView(node, view, getPos, inline) {
        var _this = this;
        this.node = node;
        this.outerView = view;
        this.getPos = getPos;
        this.dom = document.createElement(inline ? 'span' : 'div');
        this.dom.classList.add('eqn');
        this.editor = document.createElement(inline ? 'span' : 'div');
        this.editor.classList.add('eqn-editor');
        this.math = document.createElement(inline ? 'span' : 'div');
        this.math.classList.add('eqn-math');
        this.math.addEventListener('click', function () { return _this.selectNode(); });
        this.dom.appendChild(this.editor);
        this.dom.appendChild(this.math);
        this.inline = inline;
        if (this.inline) {
            this.dom.classList.add('inline');
            this.editor.classList.add('inline');
        }
        this.dom.classList.remove('editing');
        this.renderMath();
        var unfocus = function () {
            _this.dom.classList.remove('editing');
            _this.outerView.focus();
            return true;
        };
        var mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
        this.innerView = new EditorView({ mount: this.editor }, {
            state: EditorState.create({
                doc: this.node,
                plugins: [keymap(__assign(__assign({ 'Mod-z': function () { return undo(_this.outerView.state, _this.outerView.dispatch); }, 'Mod-a': function () {
                            var _a = _this.innerView.state, doc = _a.doc, tr = _a.tr;
                            var sel = TextSelection.create(doc, 0, _this.node.nodeSize - 2);
                            _this.innerView.dispatch(tr.setSelection(sel));
                            return true;
                        }, 'Mod-Z': function () { return redo(_this.outerView.state, _this.outerView.dispatch); } }, (mac ? {} : { 'Mod-y': function () { return redo(_this.outerView.state, _this.outerView.dispatch); } })), { Escape: function () {
                            _this.dom.classList.remove('editing');
                            _this.outerView.focus();
                            return true;
                        }, Enter: unfocus, 'Ctrl-Enter': chainCommands(newlineInCode, unfocus), 'Shift-Enter': chainCommands(newlineInCode, unfocus), Backspace: chainCommands(deleteSelection, function (state) {
                            if (!state.selection.empty) {
                                return false;
                            }
                            if (_this.node.textContent.length > 0) {
                                return false;
                            }
                            _this.outerView.dispatch(_this.outerView.state.tr.insertText(''));
                            _this.outerView.focus();
                            return true;
                        }) }))],
            }),
            dispatchTransaction: this.dispatchInner.bind(this),
            handleDOMEvents: {
                mousedown: function () {
                    if (_this.outerView.hasFocus())
                        _this.innerView.focus();
                    return false;
                },
            },
        });
    }
    MathView.prototype.selectNode = function () {
        var _this = this;
        var edit = isEditable(this.outerView.state);
        this.dom.classList.add('ProseMirror-selectednode');
        if (!edit)
            return;
        this.dom.classList.add('editing');
        setTimeout(function () { return _this.innerView.focus(); }, 1);
    };
    MathView.prototype.deselectNode = function () {
        this.dom.classList.remove('ProseMirror-selectednode');
        this.dom.classList.remove('editing');
    };
    MathView.prototype.dispatchInner = function (tr) {
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
    MathView.prototype.update = function (node) {
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
                this.innerView.dispatch(state.tr
                    .replace(start, endB, node.slice(start, endA))
                    .setMeta('fromOutside', true));
            }
        }
        this.renderMath();
        return true;
    };
    MathView.prototype.renderMath = function () {
        var math = this.node.textContent;
        var render = (math === null || math === void 0 ? void 0 : math.trim()) || '...';
        try {
            katex.render(render, this.math, {
                displayMode: !this.inline,
                throwOnError: false,
                macros: {
                    '\\boldsymbol': '\\mathbf',
                },
            });
        }
        catch (error) {
            this.math.innerText = error;
        }
    };
    MathView.prototype.destroy = function () {
        this.innerView.destroy();
        this.dom.textContent = '';
    };
    MathView.prototype.stopEvent = function (event) {
        var _a;
        return (_a = (this.innerView && this.innerView.dom.contains(event.target))) !== null && _a !== void 0 ? _a : false;
    };
    MathView.prototype.ignoreMutation = function () { return true; };
    return MathView;
}());
export default MathView;
//# sourceMappingURL=MathView.js.map