import { Node } from 'prosemirror-model';
import { StepMap } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import { Transaction, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { isEditable } from '../plugins/editable';

class MathView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement & { editing: boolean; requestUpdate: () => void};

  tooltip: HTMLElement;

  // These are used when the footnote is selected
  innerView: EditorView;

  node: Node;

  outerView: EditorView;

  getPos: (() => number);

  constructor(node: Node, view: EditorView, getPos: (() => number), inline: boolean) {
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;
    this.dom = document.createElement('r-equation') as any;

    this.tooltip = document.createElement('div');
    this.dom.appendChild(this.tooltip);
    this.tooltip.classList.add('equation-tooltip');
    if (inline) {
      this.dom.setAttribute('inline', '');
      this.tooltip.classList.add('inline');
    }
    this.dom.editing = false;
    // And put a sub-ProseMirror into that
    this.innerView = new EditorView(this.tooltip, {
      // You can use any node as an editor document
      state: EditorState.create({
        doc: this.node,
        plugins: [keymap({
          'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
          'Mod-Z': () => redo(this.outerView.state, this.outerView.dispatch),
          Escape: () => {
            this.dom.editing = false;
            this.outerView.focus();
            return true;
          },
          Enter: () => {
            this.dom.editing = false;
            this.outerView.focus();
            return true;
          },
          // TODO: non-mac key-bindings.
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
    this.dom.editing = true;
    // This is necessary on first insert.
    setTimeout(() => this.innerView.focus(), 1);
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
    this.dom.editing = false;
  }

  dispatchInner(tr: Transaction) {
    const { state, transactions } = this.innerView.state.applyTransaction(tr);
    this.innerView.updateState(state);

    // Update the <r-equation> component
    this.dom.setAttribute('math', state.doc.textContent);
    this.dom.requestUpdate();

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
    return true;
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
