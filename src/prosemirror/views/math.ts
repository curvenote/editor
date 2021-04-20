import { Node } from 'prosemirror-model';
import { StepMap } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { Transaction, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import katex from 'katex';
import { chainCommands, deleteSelection, newlineInCode } from 'prosemirror-commands';
import { isEditable } from '../plugins/editable';

class MathView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement;

  editor: HTMLElement;

  math: HTMLElement;

  inline: boolean;

  // These are used when the footnote is selected
  innerView: EditorView;

  node: Node;

  outerView: EditorView;

  getPos: (() => number);

  constructor(node: Node, view: EditorView, getPos: (() => number), inline: boolean) {
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');
    this.dom.classList.add('eqn');

    this.editor = document.createElement('div');
    this.editor.classList.add('eqn-editor');
    this.math = document.createElement('div');
    this.math.classList.add('eqn-math');
    this.math.addEventListener('click', () => this.selectNode());
    this.dom.appendChild(this.editor);
    this.dom.appendChild(this.math);
    this.inline = inline;
    if (this.inline) {
      this.dom.classList.add('inline');
      this.editor.classList.add('inline');
    }
    this.dom.classList.remove('editing');
    this.renderMath();

    const unfocus = () => {
      this.dom.classList.remove('editing');
      this.outerView.focus();
      return true;
    };
    const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
    // And put a sub-ProseMirror into that
    this.innerView = new EditorView(this.editor, {
      // You can use any node as an editor document
      state: EditorState.create({
        doc: this.node,
        plugins: [keymap({
          'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
          'Mod-Z': () => redo(this.outerView.state, this.outerView.dispatch),
          ...(mac ? {} : { 'Mod-y': () => redo(this.outerView.state, this.outerView.dispatch) }),
          Escape: () => {
            this.dom.classList.remove('editing');
            this.outerView.focus();
            return true;
          },
          Enter: unfocus,
          'Ctrl-Enter': chainCommands(newlineInCode, unfocus),
          'Shift-Enter': chainCommands(newlineInCode, unfocus),
          Backspace: chainCommands(deleteSelection, (state) => {
            // default backspace behavior for non-empty selections
            if (!state.selection.empty) { return false; }
            // default backspace behavior when math node is non-empty
            if (this.node.textContent.length > 0) { return false; }
            // otherwise, we want to delete the empty math node and focus the outer view
            this.outerView.dispatch(this.outerView.state.tr.insertText(''));
            this.outerView.focus();
            return true;
          }),
        })],
      }),
      // This is the magic part
      dispatchTransaction: this.dispatchInner.bind(this),
      handleDOMEvents: {
        mousedown: () => {
          // Kludge to prevent issues due to the fact that the whole
          // footnote is node-selected (and thus DOM-selected) when
          // the parent editor is focused.
          if (this.outerView.hasFocus()) this.innerView.focus();
          return false;
        },
      },
    });
  }

  selectNode() {
    const edit = isEditable(this.outerView.state);
    this.dom.classList.add('ProseMirror-selectednode');
    if (!edit) return;
    this.dom.classList.add('editing');
    // This is necessary on first insert.
    setTimeout(() => this.innerView.focus(), 1);
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
    this.dom.classList.remove('editing');
  }

  dispatchInner(tr: Transaction) {
    const { state, transactions } = this.innerView.state.applyTransaction(tr);
    this.innerView.updateState(state);

    if (!tr.getMeta('fromOutside')) {
      const outerTr = this.outerView.state.tr;
      const offsetMap = StepMap.offset(this.getPos() + 1);
      for (let i = 0; i < transactions.length; i += 1) {
        const { steps } = transactions[i];
        for (let j = 0; j < steps.length; j += 1) outerTr.step(steps[j].map(offsetMap) as any);
      }
      if (outerTr.docChanged) this.outerView.dispatch(outerTr);
    }
  }

  update(node: Node) {
    if (!node.sameMarkup(this.node)) return false;
    this.node = node;
    if (this.innerView) {
      const { state } = this.innerView;
      const start = node.content.findDiffStart(state.doc.content);
      if (start != null) {
        const ends = node.content.findDiffEnd(state.doc.content as any);
        let { a: endA, b: endB } = ends ?? { a: 0, b: 0 };
        const overlap = start - Math.min(endA, endB);
        if (overlap > 0) { endA += overlap; endB += overlap; }
        this.innerView.dispatch(
          state.tr
            .replace(start, endB, node.slice(start, endA))
            .setMeta('fromOutside', true),
        );
      }
    }
    this.renderMath();
    return true;
  }

  renderMath() {
    const math = this.node.textContent;
    // const render = math.replace(/−/g, '-');
    const render = math?.trim() || '...';
    try {
      katex.render(
        render,
        this.math,
        {
          displayMode: !this.inline,
          throwOnError: false,
          macros: {
            '\\boldsymbol': '\\mathbf',
          },
        },
      );
    } catch (error) {
      this.math.innerText = error;
    }
  }

  destroy() {
    this.innerView.destroy();
    this.dom.textContent = '';
  }

  stopEvent(event: any): boolean {
    return (this.innerView && this.innerView.dom.contains(event.target)) ?? false;
  }

  // eslint-disable-next-line class-methods-use-this
  ignoreMutation() { return true; }
}

export default MathView;
