import { EditorView } from 'prosemirror-view';
import { StepMap } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { Transaction, EditorState } from 'prosemirror-state';
import { undo, redo } from 'prosemirror-history';
import { Node } from 'prosemirror-model';
import { GetPos } from './types';

export default class FootnoteView {
  dom: HTMLElement;

  innerView: EditorView | null;

  node: Node;

  outerView: EditorView;

  getPos: () => number;

  constructor(node: Node, view: EditorView, getPos: GetPos) {
    // We'll need these later
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;

    // The node's representation in the editor (empty, for now)
    this.dom = document.createElement('footnote');
    // These are used when the footnote is selected
    this.innerView = null;
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode');
    if (!this.innerView) this.open();
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
    if (this.innerView) this.close();
  }

  open() {
    // Append a tooltip to the outer node
    const tooltip = this.dom.appendChild(document.createElement('div'));
    tooltip.className = 'footnote-tooltip';
    // And put a sub-ProseMirror into that
    this.innerView = new EditorView(tooltip, {
      // You can use any node as an editor document
      state: EditorState.create({
        doc: this.node,
        plugins: [
          keymap({
            'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
            'Mod-y': () => redo(this.outerView.state, this.outerView.dispatch),
          }),
        ],
      }),
      // This is the magic part
      dispatchTransaction: this.dispatchInner.bind(this),
      handleDOMEvents: {
        mousedown: () => {
          // Kludge to prevent issues due to the fact that the whole
          // footnote is node-selected (and thus DOM-selected) when
          // the parent editor is focused.
          if (this.outerView.hasFocus()) this.innerView?.focus();
          return false;
        },
      },
    });
  }

  close() {
    this.innerView?.destroy();
    this.innerView = null;
    this.dom.textContent = '';
  }

  dispatchInner(tr: Transaction) {
    const result = this.innerView?.state.applyTransaction(tr);
    if (!result) {
      return;
    }
    const { state, transactions } = result;

    this.innerView?.updateState(state);

    if (!tr.getMeta('fromOutside')) {
      const outerTr = this.outerView.state.tr;
      const offsetMap = StepMap.offset(this.getPos() + 1);
      for (let i = 0; i < transactions.length; i++) {
        const { steps } = transactions[i];
        for (let j = 0; j < steps.length; j++) {
          const step = steps[j].map(offsetMap);
          if (step) {
            outerTr.step(step);
          }
        }
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
        const diff = node.content.findDiffEnd(state.doc.content);
        if (diff) {
          let { a: endA, b: endB } = diff;
          const overlap = start - Math.min(endA, endB);
          if (overlap > 0) {
            endA += overlap;
            endB += overlap;
          }
          this.innerView.dispatch(
            state.tr.replace(start, endB, node.slice(start, endA)).setMeta('fromOutside', true),
          );
        }
      }
    }
    return true;
  }

  destroy() {
    if (this.innerView) this.close();
  }

  stopEvent(event: any) {
    return Boolean(this.innerView && this.innerView.dom.contains(event.target));
  }

  static ignoreMutation() {
    return true;
  }
}
