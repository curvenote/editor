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

interface CommentAddAction {
  type: 'add';
  commentId: string;
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

const reducer = (
  state: CommentState,
  tr: Transaction,
  action?: CommentAction,
): CommentState['decorations'] => {
  const { decorations } = state;
  const nextDecorations = decorations.map(tr.mapping, tr.doc);
  switch (action?.type) {
    case 'add': {
      const { from, to } = tr.selection;
      let deco: Decoration;
      const params = {
        nodeName: 'span',
        comment: action.commentId,
        class: 'anchor',
      };
      const spec = {
        comment: action.commentId,
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
      return nextDecorations;
  }
};

const getCommentsPlugin = (): Plugin<CommentState> => {
  const commentsPlugin: Plugin<CommentState> = new Plugin({
    key,
    state: {
      init: () => ({ ...emptyCommentState } as CommentState),
      apply(tr, state: CommentState): CommentState {
        const action = tr.getMeta(commentsPlugin) as CommentAction | undefined;
        const docId = opts.getDocId();
        const decorations = reducer(state, tr, action);
        // Check if we are in a comment!
        const around = decorations.find(tr.selection.from, tr.selection.to);
        if (around.length === 0) {
          const hasSelectedComment = selectors.selectedSidenote(store.getState(), docId);
          if (hasSelectedComment) store.dispatch(actions.deselectSidenote(docId));
        } else {
          const commentId = around[0].spec.comment;
          const isSelected = selectors.isSidenoteSelected(store.getState(), docId, commentId);
          if (!isSelected) {
            store.dispatch(actions.selectSidenote(docId, commentId));
          }
        }
        return {
          decorations,
        };
      },
    },
    props: {
      decorations: (state) => commentsPlugin.getState(state)?.decorations,
    },
  });
  return commentsPlugin;
};

export default getCommentsPlugin;
