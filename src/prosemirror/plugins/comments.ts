import { Plugin, PluginKey, Selection } from 'prosemirror-state';
import { isNodeSelection } from 'prosemirror-utils';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { actions, selectors, store } from '@iooxa/comments';

export interface CommentState {
  decorations: DecorationSet;
}
const emptyCommentState = {
  decorations: DecorationSet.empty,
};

export const key = new PluginKey('comments');

interface CommentAction {
  type: 'add' | 'remove';
}

export function addComment(view: EditorView) {
  const plugin = key.get(view.state) as Plugin;
  const tr = view.state.tr
    .setMeta(plugin, { type: 'add' } as CommentAction);
  view.dispatch(tr);
}

function inComment(selection: Selection, decorations: DecorationSet) {
  return decorations.find(selection.from, selection.to).length > 0;
}

const commentsPlugin: Plugin<CommentState> = new Plugin({
  key,
  state: {
    init: () => ({ ...emptyCommentState } as CommentState),
    apply(tr, state: CommentState): CommentState {
      const meta = tr.getMeta(commentsPlugin) as CommentAction | undefined;

      const docId = 'doc1';
      const { decorations } = state;
      let nextDecorations = decorations.map(tr.mapping, tr.doc);
      if (meta?.type === 'add') {
        console.log('adding comment');
        const { from, to } = tr.selection;
        let deco: Decoration;
        const params = {
          nodeName: 'comment-anchor',
          comment: 'comment1',
        };
        if (isNodeSelection(tr.selection)) {
          deco = Decoration.node(from, to, params);
        } else {
          deco = Decoration.inline(
            from, to, params, { inclusiveStart: false, inclusiveEnd: false },
          );
        }
        nextDecorations = nextDecorations.add(tr.doc, [deco]);
      }
      // Check if we are in a comment!
      const around = nextDecorations.find(tr.selection.from, tr.selection.to);
      if (around.length === 0) {
        store.dispatch(actions.deselectComment(docId));
      } else {
        const commentId = (around[0] as any).type.attrs.comment;
        const isSelected = selectors.isCommentSelected(store.getState(), docId, commentId);
        if (!isSelected) {
          store.dispatch(actions.selectComment(docId, (around[0] as any).type.attrs.comment));
        }
      }
      return {
        decorations: nextDecorations,
      };
    },
  },
  props: {
    decorations: (state) => commentsPlugin.getState(state).decorations,
  },
});

export default commentsPlugin;
