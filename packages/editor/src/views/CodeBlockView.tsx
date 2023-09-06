/**
 * Reference: https://prosemirror.net/examples/codemirror/
 */

import CodeMirror from 'codemirror';
import type { EditorView, NodeView } from 'prosemirror-view';
import type { Node } from 'prosemirror-model';
import { undo, redo } from 'prosemirror-history';
import 'codemirror/mode/python/python';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/yaml/yaml';
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
import type { EditorState, Transaction } from 'prosemirror-state';
import { Selection, TextSelection } from 'prosemirror-state';
import { findParentNode } from '@curvenote/prosemirror-utils';
import { nodeNames } from '@curvenote/schema';
import type { GetPos } from './types';
import { LanguageNames, SUPPORTED_LANGUAGES } from './types';
import { isEditable } from '../prosemirror/plugins/editable';
import { focusEditorView, insertParagraphAndSelect } from '../store/actions';
import { store } from '../connect';

function computeChange(oldVal: any, newVal: any) {
  if (oldVal === newVal) return null;
  let start = 0;
  let oldEnd = oldVal.length;
  let newEnd = newVal.length;
  while (start < oldEnd && oldVal.charCodeAt(start) === newVal.charCodeAt(start)) ++start;
  while (
    oldEnd > start &&
    newEnd > start &&
    oldVal.charCodeAt(oldEnd - 1) === newVal.charCodeAt(newEnd - 1)
  ) {
    oldEnd--;
    newEnd--;
  }
  return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) };
}

interface ModeOption {
  name: LanguageNames;
  typescript?: boolean;
  json?: boolean;
  jsonld?: boolean;
}

function createMode(node: Node): ModeOption {
  const name = node.attrs.language || SUPPORTED_LANGUAGES[0].name;
  const mode = { name };
  if (name === LanguageNames.Ts) {
    return {
      name: LanguageNames.Js,
      typescript: true,
    };
  }
  if (name === LanguageNames.Json) {
    return {
      name: LanguageNames.Js,
      typescript: false,
      json: true,
      jsonld: true,
    };
  }
  return mode;
}

function exitCode(state: EditorState, dispatch?: (tr: Transaction) => void): boolean {
  const parent =
    findParentNode((n) => n.type.name === nodeNames.figure)(state.selection) ??
    findParentNode((n) => n.type.name === nodeNames.code_block)(state.selection);
  if (!parent) return false;
  const tr = insertParagraphAndSelect(state.schema, state.tr, parent.pos + parent.node.nodeSize);
  dispatch?.(tr);
  return true;
}

class CodeBlockNodeView implements NodeView {
  view: EditorView;

  node: Node;

  getPos: GetPos;

  incomingChanges: boolean;

  cm: any;

  dom: any;

  updating: boolean;

  constructor(node: Node, view: EditorView, getPos: GetPos) {
    // Store for later
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.incomingChanges = false;
    // Create a CodeMirror instance
    this.cm = new (CodeMirror as any)(null, {
      value: this.node.textContent,
      mode: createMode(node),
      extraKeys: this.codeMirrorKeymap(),
      readOnly: isEditable(view.state) ? false : 'nocursor',
      lineNumbers: this.node.attrs.linenumbers,
    });

    // The editor's outer node is our DOM representation
    this.dom = this.cm.getWrapperElement();
    // CodeMirror needs to be in the DOM to properly initialize, so
    // schedule it to update itself
    setTimeout(() => this.cm.refresh(), 20);

    // This flag is used to avoid an update loop between the outer and
    // inner editor
    this.updating = false;
    // Track whether changes are have been made but not yet propagated
    this.cm.on('beforeChange', () => {
      this.incomingChanges = true;
    });
    // Propagate updates from the code editor to ProseMirror
    this.cm.on('cursorActivity', () => {
      if (!this.updating && !this.incomingChanges) this.forwardSelection();
    });
    this.cm.on('changes', () => {
      if (!this.updating) {
        this.valueChanged();
        this.forwardSelection();
      }
      this.incomingChanges = false;
    });
    this.cm.on('focus', () => this.forwardSelection());
  }

  forwardSelection() {
    if (!this.cm.hasFocus()) return;
    // This is required to ensure that the current view is selected (not focused though)
    store.dispatch(focusEditorView(this.view.dom.id, false));
    const { state } = this.view;
    const selection = this.asProseMirrorSelection(state.doc);
    if (!selection.eq(state.selection)) this.view.dispatch(state.tr.setSelection(selection));
  }

  asProseMirrorSelection(doc: any) {
    const offset = (this.getPos() ?? 0) + 1;
    const anchor = this.cm.indexFromPos(this.cm.getCursor('anchor')) + offset;
    const head = this.cm.indexFromPos(this.cm.getCursor('head')) + offset;
    return TextSelection.create(doc, anchor, head);
  }

  setSelection(anchor: any, head: any) {
    this.cm.focus();
    this.updating = true;
    this.cm.setSelection(this.cm.posFromIndex(anchor), this.cm.posFromIndex(head));
    this.updating = false;
  }

  valueChanged() {
    const change = computeChange(this.node.textContent, this.cm.getValue());
    if (change) {
      const start = (this.getPos() ?? 0) + 1;
      const tr = this.view.state.tr.replaceWith(
        start + change.from,
        start + change.to,
        change.text ? this.view.state.schema.text(change.text) : [],
      );
      this.view.dispatch(tr);
    }
  }

  codeMirrorKeymap() {
    const { view } = this;
    const mod = /Mac/.test(navigator.platform) ? 'Cmd' : 'Ctrl';
    return CodeMirror.normalizeKeyMap({
      Up: () => this.maybeEscape('line', -1),
      Left: () => this.maybeEscape('char', -1),
      Down: () => this.maybeEscape('line', 1),
      Right: () => this.maybeEscape('char', 1),
      Esc: () => {
        // TODO: change this to select the node, and then enter
        if (exitCode(view.state, view.dispatch)) view.focus();
      },
      Backspace: () => {
        if (this.node.textContent.length > 0) return CodeMirror.Pass;
        // When you hit backspace in an empty codeblock, create a paragraph and select the text inside of it
        const pos = this.getPos() ?? 0;
        const { schema } = view.state;
        const paragraph = schema.nodes.paragraph.create();
        const tr = view.state.tr.delete(pos, pos + this.node.nodeSize).insert(pos, paragraph);
        // The selection should be in the same place as before the delete
        // Note, we could replace the node instead, that might be better
        const { selection } = view.state;
        const selectedTr = tr
          .setSelection(TextSelection.create(tr.doc, selection.from))
          .scrollIntoView();
        view.dispatch(selectedTr);
        view.focus();
        return true;
      },
      'Shift-Enter': () => {
        this.cm.execCommand('newlineAndIndent');
      },
      [`${mod}-Enter`]: () => {
        if (exitCode(view.state, view.dispatch)) view.focus();
      },
      [`${mod}-Z`]: () => undo(view.state, view.dispatch),
      [`Shift-${mod}-Z`]: () => redo(view.state, view.dispatch),
      [`${mod}-Y`]: () => redo(view.state, view.dispatch),
    });
  }

  // eslint-disable-next-line consistent-return
  maybeEscape(unit: any, dir: any) {
    const pos = this.cm.getCursor();
    if (
      this.cm.somethingSelected() ||
      pos.line !== (dir < 0 ? this.cm.firstLine() : this.cm.lastLine()) ||
      (unit === 'char' && pos.ch !== (dir < 0 ? 0 : this.cm.getLine(pos.line).length))
    )
      return CodeMirror.Pass;
    this.view.focus();
    const targetPos = (this.getPos() ?? 0) + (dir < 0 ? 0 : this.node.nodeSize);
    const selection = Selection.near(this.view.state.doc.resolve(targetPos), dir);
    this.view.dispatch(this.view.state.tr.setSelection(selection).scrollIntoView());
    this.view.focus();
  }

  update(node: any) {
    if (node.type !== this.node.type) return false;
    if (this.node.attrs.language !== node.attrs.language) {
      this.cm.setOption('mode', createMode(node));
    }
    if (this.node.attrs.linenumbers !== node.attrs.linenumbers) {
      this.cm.setOption('lineNumbers', node.attrs.linenumbers);
    }

    this.node = node;
    const change = computeChange(this.cm.getValue(), node.textContent);
    if (change) {
      this.updating = true;
      this.cm.replaceRange(
        change.text,
        this.cm.posFromIndex(change.from),
        this.cm.posFromIndex(change.to),
      );
      this.updating = false;
    }
    return true;
  }

  selectNode() {
    const edit = isEditable(this.view.state);
    this.cm.setOption('readOnly', edit ? false : 'nocursor');
    if (!edit) return;
    this.cm.focus();
  }

  static stopEvent() {
    return true;
  }
}

export function CodeBlockView(node: Node, view: EditorView, getPos: GetPos) {
  return new CodeBlockNodeView(node, view, getPos);
}
