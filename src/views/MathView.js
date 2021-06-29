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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { StepMap } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { chainCommands, deleteSelection, newlineInCode } from 'prosemirror-commands';
import { isEditable } from '../prosemirror/plugins/editable';
export function renderMath(math, element, inline) {
    return __awaiter(this, void 0, void 0, function () {
        var render, katex_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render = (math === null || math === void 0 ? void 0 : math.trim()) || '...';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, import('katex')];
                case 2:
                    katex_1 = _a.sent();
                    katex_1.render(render, element, {
                        displayMode: !inline,
                        throwOnError: false,
                        macros: {
                            '\\boldsymbol': '\\mathbf',
                        },
                    });
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    element.innerText = error_1;
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
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
        else {
            this.dom.classList.add('display');
        }
        this.addFakeCursor();
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
                plugins: [
                    keymap(__assign(__assign({ 'Mod-a': function () {
                            var _a = _this.innerView.state, doc = _a.doc, tr = _a.tr;
                            var sel = TextSelection.create(doc, 0, _this.node.nodeSize - 2);
                            _this.innerView.dispatch(tr.setSelection(sel));
                            return true;
                        }, 'Mod-z': function () { return undo(_this.outerView.state, _this.outerView.dispatch); }, 'Mod-Z': function () { return redo(_this.outerView.state, _this.outerView.dispatch); } }, (mac
                        ? {}
                        : { 'Mod-y': function () { return redo(_this.outerView.state, _this.outerView.dispatch); } })), { Escape: function () {
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
                        }) })),
                ],
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
    MathView.prototype.addFakeCursor = function () {
        if (!this.inline)
            return;
        var hasContent = this.node.textContent.length > 0;
        this.editor.classList[hasContent ? 'remove' : 'add']('empty');
    };
    MathView.prototype.update = function (node) {
        if (!node.sameMarkup(this.node))
            return false;
        this.node = node;
        this.addFakeCursor();
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
        this.renderMath();
        return true;
    };
    MathView.prototype.renderMath = function () {
        if (this.node.attrs.numbered) {
            this.dom.setAttribute('numbered', '');
        }
        else {
            this.dom.removeAttribute('numbered');
        }
        renderMath(this.node.textContent, this.math, this.inline);
    };
    MathView.prototype.destroy = function () {
        this.innerView.destroy();
        this.dom.textContent = '';
    };
    MathView.prototype.stopEvent = function (event) {
        var _a;
        return (_a = (this.innerView && this.innerView.dom.contains(event.target))) !== null && _a !== void 0 ? _a : false;
    };
    MathView.prototype.ignoreMutation = function () {
        return true;
    };
    return MathView;
}());
export default MathView;
//# sourceMappingURL=MathView.js.map