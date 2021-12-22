import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { createId } from '@curvenote/schema';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { actions, selectors, store } from 'sidenotes';
import { Node } from 'prosemirror-model';

export interface CommentState {
  docId: string;
  selectedComment: string | null;
  decorations: DecorationSet;
}
const emptyCommentState: CommentState = {
  docId: '',
  selectedComment: null,
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
  selected: boolean;
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

interface CommentSelectAction {
  type: 'select';
  commentId: string;
}

type CommentAction = CommentAddAction | CommentRemoveAction | CommentSelectAction;

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

function createDecoration(
  commentId: string,
  selectedComment: string | null,
  from: number,
  to: number,
  reuseDomId: string | null,
) {
  const domId = reuseDomId ?? createId();
  const selected = selectedComment === commentId;
  const params = {
    nodeName: 'span',
    class: selected ? 'anchor selected' : 'anchor',
    id: domId, // Note, this ID might be split into many different dom nodes, but that is fine.
  };
  const spec: DecorationSpec = {
    id: commentId,
    domId,
    selected,
    inclusiveStart: false,
    inclusiveEnd: false,
  };
  return Decoration.inline(from, to, params, spec);
  // TODO: This has to be based on the actual from/to
  // NodeSelection.create(tr.doc, from);
  // if (isNodeSelection(tr.selection)) {
  //   deco = Decoration.node(from, to, params, spec);
  // }
}

function updateSelectedDecorations(
  decorations: DecorationSet,
  selectedId: string | null,
  doc: Node,
): DecorationSet {
  const remove = decorations.find(undefined, undefined, (_spec) => {
    const spec = _spec as DecorationSpec;
    return (spec.selected && spec.id !== selectedId) || (!spec.selected && spec.id === selectedId);
  });
  if (remove.length === 0) return decorations;
  const add = remove.map((deco) => {
    const spec = deco.spec as DecorationSpec;
    return createDecoration(spec.id, selectedId, deco.from, deco.to, spec.domId);
  });
  return decorations.remove(remove).add(doc, add);
}

function reducer(tr: Transaction, state: CommentState): CommentState {
  const { decorations } = state;
  // Always update the decorations with the mapping
  const nextDecorations = decorations.map(tr.mapping, tr.doc, {
    onRemove: (spec) => {
      store.dispatch(actions.disconnectAnchor(state.docId, (spec as DecorationSpec).domId));
    },
  });
  const action = tr.getMeta(key) as (CommentAction & { docId?: string }) | undefined;
  const { selectedComment } = state;
  const docId = action?.docId ?? state.docId;
  if (!action) {
    // Check if we are in a comment!
    const around = decorations.find(tr.selection.from, tr.selection.to);
    if (around.length === 0) {
      // We are not in a comment, and the action to select does not exist
      const hasSelectedComment = selectors.selectedSidenote(store.getState(), docId);
      if (hasSelectedComment) store.dispatch(actions.deselectSidenote(docId));
      const selected = updateSelectedDecorations(nextDecorations, null, tr.doc);
      return { docId, selectedComment: null, decorations: selected };
    }
    const { id, domId } = around[0].spec as DecorationSpec;
    const isSelected = selectors.isSidenoteSelected(store.getState(), docId, id);
    if (!isSelected) store.dispatch(actions.selectAnchor(docId, domId));
    const selected = updateSelectedDecorations(nextDecorations, id, tr.doc);
    return { docId, selectedComment: id, decorations: selected };
  }
  switch (action?.type) {
    case 'add': {
      const from = action.from ?? tr.selection.from;
      const to = action.to ?? tr.selection.to;
      const deco = createDecoration(action.commentId, selectedComment, from, to, null);
      store.dispatch(actions.connectAnchor(docId, action.commentId, deco.spec.domId));
      return { docId, selectedComment, decorations: nextDecorations.add(tr.doc, [deco]) };
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
      return { docId, selectedComment, decorations: nextDecorations.remove(decos) };
    }
    case 'select': {
      const { commentId: selectedId } = action;
      const selected = updateSelectedDecorations(nextDecorations, action.commentId, tr.doc);
      return { docId, selectedComment: selectedId, decorations: selected };
    }
    default:
      throw new Error(`Unhandled comment plugin action of type "${(action as any).type}"`);
  }
}

const getCommentsPlugin = (): Plugin<CommentState> => {
  const commentsPlugin: Plugin<CommentState> = new Plugin({
    key,
    state: {
      init: (): CommentState => ({ ...emptyCommentState }),
      apply(tr, state: CommentState): CommentState {
        return reducer(tr, state);
      },
    },
    props: {
      decorations: (state) => commentsPlugin.getState(state).decorations,
    },
  });
  return commentsPlugin;
};

export default getCommentsPlugin;
