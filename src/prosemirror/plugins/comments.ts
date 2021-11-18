import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { isNodeSelection } from 'prosemirror-utils';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { actions, selectors, store } from 'sidenotes';
import { opts } from '../../connect';

export interface CommentState {
  decorations: DecorationSet;
}
const emptyCommentState = {
  decorations: DecorationSet.empty,
};

export const key = new PluginKey('comments');

export interface CommentInfo {
  id: string;
  from: number;
  to: number;
  text: string;
}

interface DecorationSpec {
  id: string;
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
export function getCommentInfo(view: EditorView, id?: string): CommentInfo | null {
  const plugin = key.get(view.state);
  const { decorations } = (plugin?.getState(view.state) ?? {}) as { decorations: DecorationSet };
  if (!decorations || !id) return null;
  const deco = decorations.find(
    undefined,
    undefined,
    (spec) => (spec as DecorationSpec).id === id,
  )[0];
  if (!deco) return null;
  const { from, to } = deco;
  const text = view.state.doc.textBetween(from, to);
  return { id, from, to, text };
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
  const tr = view.state.tr.setMeta(plugin, action);
  view.dispatch(tr);
}

// function inComment(selection: Selection, decorations: DecorationSet) {
//   return decorations.find(selection.from, selection.to).length > 0;
// }

function reducer(state: CommentState, tr: Transaction): CommentState['decorations'] {
  const { decorations } = state;
  // Always update the decorations with the mapping
  const nextDecorations = decorations.map(tr.mapping, tr.doc);
  const action = tr.getMeta(key) as CommentAction | undefined;
  if (!action) return nextDecorations;
  switch (action?.type) {
    case 'add': {
      const from = action.from ?? tr.selection.from;
      const to = action.to ?? tr.selection.to;
      let deco: Decoration;
      const params = {
        nodeName: 'span',
        class: 'anchor',
        comment: action.commentId,
      };
      const spec: DecorationSpec = {
        id: action.commentId,
        inclusiveStart: false,
        inclusiveEnd: false,
      };
      if (isNodeSelection(tr.selection)) {
        deco = Decoration.node(from, to, params, spec);
      } else {
        deco = Decoration.inline(from, to, params, spec);
      }
      return nextDecorations.add(tr.doc, [deco]);
    }
    case 'remove': {
      const { commentId } = action;
      const deco = nextDecorations.find(undefined, undefined, (spec) => spec.comment === commentId);
      return nextDecorations.remove(deco);
    }
    default:
      throw new Error(`Unhandled comment plugin action of type "${(action as any).type}"`);
  }
}

const getCommentsPlugin = (): Plugin<CommentState> => {
  const commentsPlugin: Plugin<CommentState> = new Plugin({
    key,
    state: {
      init: () => ({ ...emptyCommentState } as CommentState),
      apply(tr, state: CommentState): CommentState {
        // TODO: This docId should come in through the plugin init, it won't ever change
        //       Then I think that we can delete it from the connect
        const docId = opts.getDocId();
        const decorations = reducer(state, tr);
        // Check if we are in a comment!
        const around = decorations.find(tr.selection.from, tr.selection.to);
        if (around.length === 0) {
          const hasSelectedComment = selectors.selectedSidenote(store.getState(), docId);
          if (hasSelectedComment) store.dispatch(actions.deselectSidenote(docId));
        } else {
          const { id } = around[0].spec as DecorationSpec;
          const isSelected = selectors.isSidenoteSelected(store.getState(), docId, id);
          if (!isSelected) {
            store.dispatch(actions.selectSidenote(docId, id));
          }
        }
        return {
          decorations,
        };
      },
    },
    props: {
      decorations: (state) => commentsPlugin.getState(state).decorations,
    },
  });
  return commentsPlugin;
};

export default getCommentsPlugin;
