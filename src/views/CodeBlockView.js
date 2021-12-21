import CodeMirror from 'codemirror';
import { undo, redo } from 'prosemirror-history';
import 'codemirror/mode/python/python';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/php/php';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/julia/julia';
import 'codemirror/mode/r/r';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/rust/rust';
import 'codemirror/mode/go/go';
import { Selection, TextSelection } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { nodeNames } from '@curvenote/schema';
import { LanguageNames, SUPPORTED_LANGUAGES } from './types';
import { isEditable } from '../prosemirror/plugins/editable';
import { focusEditorView, insertParagraphAndSelect } from '../store/actions';
import { store } from '../connect';
function computeChange(oldVal, newVal) {
    if (oldVal === newVal)
        return null;
    var start = 0;
    var oldEnd = oldVal.length;
    var newEnd = newVal.length;
    while (start < oldEnd && oldVal.charCodeAt(start) === newVal.charCodeAt(start))
        ++start;
    while (oldEnd > start &&
        newEnd > start &&
        oldVal.charCodeAt(oldEnd - 1) === newVal.charCodeAt(newEnd - 1)) {
        oldEnd--;
        newEnd--;
    }
    return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) };
}
function createMode(node) {
    var name = node.attrs.language || SUPPORTED_LANGUAGES[0].name;
    var mode = { name: name };
    if (name === LanguageNames.Ts) {
        return {
            name: LanguageNames.Js,
            typescript: true,
        };
    }
    return mode;
}
function exitCode(state, dispatch) {
    var _a;
    var parent = (_a = findParentNode(function (n) { return n.type.name === nodeNames.figure; })(state.selection)) !== null && _a !== void 0 ? _a : findParentNode(function (n) { return n.type.name === nodeNames.code_block; })(state.selection);
    if (!parent)
        return false;
    var tr = insertParagraphAndSelect(state.schema, state.tr, parent.pos + parent.node.nodeSize);
    dispatch === null || dispatch === void 0 ? void 0 : dispatch(tr);
    return true;
}
var CodeBlockNodeView = (function () {
    function CodeBlockNodeView(node, view, getPos) {
        var _this = this;
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.incomingChanges = false;
        this.cm = new CodeMirror(null, {
            value: this.node.textContent,
            mode: createMode(node),
            extraKeys: this.codeMirrorKeymap(),
            readOnly: isEditable(view.state) ? false : 'nocursor',
            lineNumbers: this.node.attrs.linenumbers,
        });
        this.dom = this.cm.getWrapperElement();
        setTimeout(function () { return _this.cm.refresh(); }, 20);
        this.updating = false;
        this.cm.on('beforeChange', function () {
            _this.incomingChanges = true;
        });
        this.cm.on('cursorActivity', function () {
            if (!_this.updating && !_this.incomingChanges)
                _this.forwardSelection();
        });
        this.cm.on('changes', function () {
            if (!_this.updating) {
                _this.valueChanged();
                _this.forwardSelection();
            }
            _this.incomingChanges = false;
        });
        this.cm.on('focus', function () { return _this.forwardSelection(); });
    }
    CodeBlockNodeView.prototype.forwardSelection = function () {
        if (!this.cm.hasFocus())
            return;
        store.dispatch(focusEditorView(this.view.dom.id, false));
        var state = this.view.state;
        var selection = this.asProseMirrorSelection(state.doc);
        if (!selection.eq(state.selection))
            this.view.dispatch(state.tr.setSelection(selection));
    };
    CodeBlockNodeView.prototype.asProseMirrorSelection = function (doc) {
        var offset = this.getPos() + 1;
        var anchor = this.cm.indexFromPos(this.cm.getCursor('anchor')) + offset;
        var head = this.cm.indexFromPos(this.cm.getCursor('head')) + offset;
        return TextSelection.create(doc, anchor, head);
    };
    CodeBlockNodeView.prototype.setSelection = function (anchor, head) {
        this.cm.focus();
        this.updating = true;
        this.cm.setSelection(this.cm.posFromIndex(anchor), this.cm.posFromIndex(head));
        this.updating = false;
    };
    CodeBlockNodeView.prototype.valueChanged = function () {
        var change = computeChange(this.node.textContent, this.cm.getValue());
        if (change) {
            var start = this.getPos() + 1;
            var tr = this.view.state.tr.replaceWith(start + change.from, start + change.to, change.text ? this.view.state.schema.text(change.text) : null);
            this.view.dispatch(tr);
        }
    };
    CodeBlockNodeView.prototype.codeMirrorKeymap = function () {
        var _a;
        var _this = this;
        var view = this.view;
        var mod = /Mac/.test(navigator.platform) ? 'Cmd' : 'Ctrl';
        return CodeMirror.normalizeKeyMap((_a = {
                Up: function () { return _this.maybeEscape('line', -1); },
                Left: function () { return _this.maybeEscape('char', -1); },
                Down: function () { return _this.maybeEscape('line', 1); },
                Right: function () { return _this.maybeEscape('char', 1); },
                Esc: function () {
                    if (exitCode(view.state, view.dispatch))
                        view.focus();
                },
                Backspace: function () {
                    if (_this.node.textContent.length > 0)
                        return CodeMirror.Pass;
                    var pos = _this.getPos();
                    var schema = view.state.schema;
                    var paragraph = schema.nodes.paragraph.create('');
                    var tr = view.state.tr.delete(pos, pos + _this.node.nodeSize).insert(pos, paragraph);
                    var selection = view.state.selection;
                    var selectedTr = tr
                        .setSelection(TextSelection.create(tr.doc, selection.from))
                        .scrollIntoView();
                    view.dispatch(selectedTr);
                    view.focus();
                    return true;
                },
                'Shift-Enter': function () {
                    _this.cm.execCommand('newlineAndIndent');
                }
            },
            _a["".concat(mod, "-Enter")] = function () {
                if (exitCode(view.state, view.dispatch))
                    view.focus();
            },
            _a["".concat(mod, "-Z")] = function () { return undo(view.state, view.dispatch); },
            _a["Shift-".concat(mod, "-Z")] = function () { return redo(view.state, view.dispatch); },
            _a["".concat(mod, "-Y")] = function () { return redo(view.state, view.dispatch); },
            _a));
    };
    CodeBlockNodeView.prototype.maybeEscape = function (unit, dir) {
        var pos = this.cm.getCursor();
        if (this.cm.somethingSelected() ||
            pos.line !== (dir < 0 ? this.cm.firstLine() : this.cm.lastLine()) ||
            (unit === 'char' && pos.ch !== (dir < 0 ? 0 : this.cm.getLine(pos.line).length)))
            return CodeMirror.Pass;
        this.view.focus();
        var targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize);
        var selection = Selection.near(this.view.state.doc.resolve(targetPos), dir);
        this.view.dispatch(this.view.state.tr.setSelection(selection).scrollIntoView());
        this.view.focus();
    };
    CodeBlockNodeView.prototype.update = function (node) {
        if (node.type !== this.node.type)
            return false;
        if (this.node.attrs.language !== node.attrs.language) {
            this.cm.setOption('mode', createMode(node));
        }
        if (this.node.attrs.linenumbers !== node.attrs.linenumbers) {
            this.cm.setOption('lineNumbers', node.attrs.linenumbers);
        }
        this.node = node;
        var change = computeChange(this.cm.getValue(), node.textContent);
        if (change) {
            this.updating = true;
            this.cm.replaceRange(change.text, this.cm.posFromIndex(change.from), this.cm.posFromIndex(change.to));
            this.updating = false;
        }
        return true;
    };
    CodeBlockNodeView.prototype.selectNode = function () {
        var edit = isEditable(this.view.state);
        this.cm.setOption('readOnly', edit ? false : 'nocursor');
        if (!edit)
            return;
        this.cm.focus();
    };
    CodeBlockNodeView.stopEvent = function () {
        return true;
    };
    return CodeBlockNodeView;
}());
export function CodeBlockView(node, view, getPos) {
    return new CodeBlockNodeView(node, view, getPos);
}
//# sourceMappingURL=CodeBlockView.js.map