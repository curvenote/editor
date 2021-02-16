import { StepMap } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { isEditable } from '../plugins/editable';
var MathView = (function () {
    function MathView(node, view, getPos, inline) {
        var _this = this;
        this.node = node;
        this.outerView = view;
        this.getPos = getPos;
        this.dom = document.createElement('r-equation');
        this.tooltip = document.createElement('div');
        this.dom.appendChild(this.tooltip);
        this.tooltip.classList.add('equation-tooltip');
        if (inline) {
            this.dom.setAttribute('inline', '');
            this.tooltip.classList.add('inline');
        }
        this.dom.editing = false;
        this.innerView = new EditorView(this.tooltip, {
            state: EditorState.create({
                doc: this.node,
                plugins: [keymap({
                        'Mod-z': function () { return undo(_this.outerView.state, _this.outerView.dispatch); },
                        'Mod-Z': function () { return redo(_this.outerView.state, _this.outerView.dispatch); },
                        Escape: function () {
                            _this.dom.editing = false;
                            _this.outerView.focus();
                            return true;
                        },
                        Enter: function () {
                            _this.dom.editing = false;
                            _this.outerView.focus();
                            return true;
                        },
                    })],
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
        this.dom.editing = true;
        setTimeout(function () { return _this.innerView.focus(); }, 1);
    };
    MathView.prototype.deselectNode = function () {
        this.dom.classList.remove('ProseMirror-selectednode');
        this.dom.editing = false;
    };
    MathView.prototype.dispatchInner = function (tr) {
        var _a = this.innerView.state.applyTransaction(tr), state = _a.state, transactions = _a.transactions;
        this.innerView.updateState(state);
        this.dom.setAttribute('math', state.doc.textContent);
        this.dom.requestUpdate();
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
        return true;
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
//# sourceMappingURL=math.js.map