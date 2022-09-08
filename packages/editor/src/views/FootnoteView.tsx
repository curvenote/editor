import type { Node } from 'prosemirror-model';
import { StepMap } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';
import type { Transaction } from 'prosemirror-state';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { chainCommands, deleteSelection, newlineInCode } from 'prosemirror-commands';
import { isEditable } from '../prosemirror/plugins/editable';
import { getInlinePlugins } from '../prosemirror/plugins';
import { MathView } from './MathView';
import type { GetPos } from './types';
import type { Store } from '../store';

class FootnoteNodeView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLElement;

  editor: HTMLElement;

  // These are used when the footnote is selected
  innerView: EditorView;

  node: Node;

  outerView: EditorView;

  getPos: GetPos;

  constructor(node: Node, view: EditorView, getPos: GetPos, store: Store) {
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;
    this.dom = document.createElement('span');
    this.dom.classList.add('footnote');

    this.editor = document.createElement('span');
    this.editor.classList.add('tooltip');
    this.dom.addEventListener('click', () => this.selectNode());
    this.dom.addEventListener('mouseenter', () => this.positionTooltip());
    this.dom.appendChild(this.editor);
    const unfocus = () => {
      this.dom.classList.remove('open');
      this.outerView.focus();
      return true;
    };
    const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
    // And put a sub-ProseMirror into that
    this.innerView = new EditorView(
      {
        mount: this.editor,
      },
      {
        editable: () => isEditable(view.state),
        // You can use any node as an editor document
        state: EditorState.create({
          doc: this.node,
          plugins: [
            ...getInlinePlugins(this.outerView.state.schema, { store }),
            keymap({
              'Mod-a': () => {
                const { doc, tr } = this.innerView.state;
                const sel = TextSelection.create(doc, 0, this.node.nodeSize - 2);
                this.innerView.dispatch(tr.setSelection(sel));
                return true;
              },
              'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
              'Mod-Z': () => redo(this.outerView.state, this.outerView.dispatch),
              ...(mac
                ? {}
                : { 'Mod-y': () => redo(this.outerView.state, this.outerView.dispatch) }),
              Escape: unfocus,
              Tab: unfocus,
              'Shift-Tab': unfocus,
              Enter: unfocus,
              'Ctrl-Enter': chainCommands(newlineInCode, unfocus),
              Backspace: chainCommands(deleteSelection, (state) => {
                // default backspace behavior for non-empty selections
                if (!state.selection.empty) {
                  return false;
                }
                // default backspace behavior when math node is non-empty
                if (this.node.textContent.length > 0) {
                  return false;
                }
                // otherwise, we want to delete the empty math node and focus the outer view
                this.outerView.dispatch(this.outerView.state.tr.insertText(''));
                this.outerView.focus();
                return true;
              }),
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
            const editable = isEditable(this.outerView.state);
            if (editable && this.outerView.hasFocus()) this.innerView.focus();
            return false;
          },
        },
        nodeViews: {
          math: MathView,
        },
      },
    );
  }

  positionTooltip() {
    const { offsetTop, offsetHeight } = this.dom;
    this.editor.style.top = `${offsetTop + offsetHeight + 8}px`;
  }

  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode');
    this.dom.classList.add('open');
    if (isEditable(this.outerView.state)) {
      this.positionTooltip();
      setTimeout(() => this.innerView.focus(), 0); // setTimeout is to ensure component is rendered
    }
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
    this.dom.classList.remove('open');
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
        if (overlap > 0) {
          endA += overlap;
          endB += overlap;
        }
        this.innerView.dispatch(
          state.tr.replace(start, endB, node.slice(start, endA)).setMeta('fromOutside', true),
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
  ignoreMutation() {
    return true;
  }
}

export function createFootnoteViewFactory(store: Store) {
  return (node: Node, view: EditorView, getPos: GetPos) => {
    return new FootnoteNodeView(node, view, getPos, store);
  };
}
