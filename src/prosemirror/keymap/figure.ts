import { nodeNames } from '@curvenote/schema';
import { Schema } from 'prosemirror-model';
import { EditorState, NodeSelection, TextSelection, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { KeyMap } from './types';

function insertParagraphAndSelect(view: EditorView, side: number, out: number = 0) {
  const transaction = view.state.tr.insert(
    side,
    view.state.schema.nodes[nodeNames.paragraph].createAndFill(),
  );
  transaction.setSelection(TextSelection.create(transaction.doc, side + out));
  return transaction;
}

function selectParent(view: EditorView, start: number) {
  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, start - 1))); // -1 to select the parent node instead of the beginning of the parentnode
}

export const handleBackspace: KeyMap = function handleBackspace(
  state,
  dispatch,
  view?: EditorView,
) {
  const { $head } = state.selection;
  if ($head.parent.type.name === nodeNames.figcaption) {
    const figcaption = $head.parent;
    const figure = $head.node($head.depth - 1);
    if (figure.type.name !== nodeNames.figure) {
      return false;
    }

    let imageIndex = -1;
    let captionIndex = -1;

    figure.forEach((child, _offset, i) => {
      if (child.type.name === nodeNames.image) {
        imageIndex = i;
      }
      if (child.eq(figcaption)) {
        captionIndex = i;
      }
    });

    if (!view || !dispatch) {
      return false;
    }

    if (imageIndex === -1) {
    } else {
      if (captionIndex > -1) {
        const start = $head.start();
        if (captionIndex > imageIndex) {
          // when caption is below the image
          if (start === $head.pos) {
            // selection is at the end of the caption, we create a new paragraph below
            dispatch(state.tr.setSelection(NodeSelection.create(state.doc, start - 2 - 1))); // TODO: refactor this to not depend on hardcoded position
            return true;
          }
        }
      } else {
        // shouldn't reach here since caption should exsits in the figure
        return false;
      }
    }
  }
  return false;
};

export const handleEnterCommand: KeyMap = function handleEnterCommand(
  state: EditorState,
  dispatch?: (p: Transaction<Schema>) => void,
  view?: EditorView,
) {
  const { $head } = state.selection;
  if ($head.parent.type.name === nodeNames.figcaption) {
    const figcaption = $head.parent;
    const figure = $head.node($head.depth - 1);
    if (figure.type.name !== nodeNames.figure) {
      return false;
    }

    let imageIndex = -1;
    let captionIndex = -1;

    figure.forEach((child, _offset, i) => {
      if (child.type.name === nodeNames.image) {
        imageIndex = i;
      }
      if (child.eq(figcaption)) {
        captionIndex = i;
      }
    });

    if (!view || !dispatch) {
      return false;
    }

    if (imageIndex === -1) {
    } else {
      if (captionIndex > -1) {
        const start = $head.start();
        const end = $head.end();
        const depth = $head.depth;
        if (captionIndex > imageIndex) {
          // when caption is below the image
          if (end === $head.pos) {
            // selection is at the end of the caption, we create a new paragraph below
            view.dispatch(insertParagraphAndSelect(view, end + depth, 1));
          } else {
            selectParent(view, start);
          }
          return true;
        } else {
          // when caption is above the image
          if ($head.pos === start) {
            view.dispatch(insertParagraphAndSelect(view, start - depth));
          } else {
            selectParent(view, start);
          }
          return true;
        }
      } else {
        // shouldn't reach here since caption should exsits in the figure
        return false;
      }
    }
  }
  return false;
};
