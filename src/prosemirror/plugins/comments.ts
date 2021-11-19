import { Plugin, PluginKey, Transaction, NodeSelection } from 'prosemirror-state';
import { isNodeSelection } from 'prosemirror-utils';
import { createId } from '@curvenote/schema';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { actions, selectors, store } from 'sidenotes';

export interface CommentState {
  docId: string;
  decorations: DecorationSet;
}
const emptyCommentState = {
  decorations: DecorationSet.empty,
};

export const key = new PluginKey('comments');

export interface DecorationRange {
  from: number;
  to: number;
  text: string;
}
export interface CommentInfo {
  id: string;
  ranges: DecorationRange[];
}

interface DecorationSpec {
  id: string;
  domId: string;
  inclusiveStart: boolean;
  inclusiveEnd: boolean;
}

/**
 * Get the current range information about a comment decoration.
 *
 * @param view The editor view
 * @param id The id of the comment decoration
 * @returns The current from/to and selected text if the ID exists
 */
export function getCommentInfo(view: EditorView, id: string): CommentInfo | null {
  const plugin = key.get(view.state);
  const { decorations } = (plugin?.getState(view.state) ?? {}) as { decorations: DecorationSet };
  if (!decorations) return null;
  const decos = decorations.find(
    undefined,
    undefined,
    (spec) => (spec as DecorationSpec).id === id,
  );
  if (!decos.length) return null;
  const ranges = decos.map((deco) => {
    const { from, to } = deco;
    const text = view.state.doc.textBetween(from, to);
    return { from, to, text };
  });
  return { id, ranges };
}

interface CommentAddAction {
  type: 'add';
  commentId: string;
  from?: number;
  to?: number;
}

interface CommentRemoveAction {
  type: 'remove';
  commentId: string;
}

type CommentAction = CommentAddAction | CommentRemoveAction;

export function dispatchCommentAction(view: EditorView, action: CommentAction) {
  const plugin = key.get(view.state) as Plugin;
  const state = plugin.getState(view.state) as CommentState;
  let { docId } = state;
  if (!docId) {
    // The docId is difficult to pass down to the state, just grab it from the articleId
    let el = view.dom as HTMLElement | null;
    do {
      el = (el?.parentElement ?? null) as HTMLElement | null;
    } while (el && el.tagName !== 'ARTICLE');
    docId = el?.id ?? docId;
  }
  const tr = view.state.tr.setMeta(plugin, { ...action, docId });
  view.dispatch(tr);
}

function reducer(state: CommentState, tr: Transaction): CommentState {
  const { decorations } = state;
  // Always update the decorations with the mapping
  const nextDecorations = decorations.map(tr.mapping, tr.doc);
  const action = tr.getMeta(key) as (CommentAction & { docId?: string }) | undefined;
  const docId = action?.docId ?? state.docId;
  if (!action) return { docId, decorations: nextDecorations };
  switch (action?.type) {
    case 'add': {
      const from = action.from ?? tr.selection.from;
      const to = action.to ?? tr.selection.to;
      let deco: Decoration;
      const domId = createId();
      const params = {
        nodeName: 'span',
        class: 'anchor',
        id: domId,
      };
      const spec: DecorationSpec = {
        id: action.commentId,
        domId,
        inclusiveStart: false,
        inclusiveEnd: false,
      };
      // TODO: This has to be based on the actual from/to
      // NodeSelection.create(tr.doc, from);
      if (isNodeSelection(tr.selection)) {
        deco = Decoration.node(from, to, params, spec);
      } else {
        deco = Decoration.inline(from, to, params, spec);
      }
      store.dispatch(actions.connectAnchor(docId, action.commentId, domId));
      return { docId, decorations: nextDecorations.add(tr.doc, [deco]) };
    }
    case 'remove': {
      const { commentId } = action;
      const decos = nextDecorations.find(
        undefined,
        undefined,
        (spec) => (spec as DecorationSpec).id === commentId,
      );
      decos.forEach((deco) => {
        const spec = deco.spec as DecorationSpec;
        store.dispatch(actions.disconnectAnchor(docId, spec.domId));
      });
      return { docId, decorations: nextDecorations.remove(decos) };
    }
    default:
      throw new Error(`Unhandled comment plugin action of type "${(action as any).type}"`);
  }
}

const getCommentsPlugin = (): Plugin<CommentState> => {
  const commentsPlugin: Plugin<CommentState> = new Plugin({
    key,
    state: {
      init: () => ({ docId: '', ...emptyCommentState } as CommentState),
      apply(tr, state: CommentState): CommentState {
        const { docId, decorations } = reducer(state, tr);
        // Check if we are in a comment!
        const around = decorations.find(tr.selection.from, tr.selection.to);
        if (around.length === 0) {
          const hasSelectedComment = selectors.selectedSidenote(store.getState(), docId);
          if (hasSelectedComment) store.dispatch(actions.deselectSidenote(docId));
        } else {
          const { id, domId } = around[0].spec as DecorationSpec;
          const isSelected = selectors.isSidenoteSelected(store.getState(), docId, id);
          if (!isSelected) {
            store.dispatch(actions.selectAnchor(docId, domId));
          }
        }
        return { docId, decorations };
      },
    },
    props: {
      decorations: (state) => commentsPlugin.getState(state).decorations,
    },
  });
  return commentsPlugin;
};

export default getCommentsPlugin;
