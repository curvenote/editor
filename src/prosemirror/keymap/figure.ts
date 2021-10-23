import { nodeNames } from '@curvenote/schema';
import { Schema } from 'prosemirror-model';
import { EditorState, NodeSelection, TextSelection, Transaction } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { KeyMap } from './types';

function insertParagraphAndSelect(view: EditorView, side: number) {
  const transaction = view.state.tr.insert(
    side,
    view.state.schema.nodes[nodeNames.paragraph].createAndFill(),
  );
  transaction.setSelection(TextSelection.create(transaction.doc, side + 1));
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

    if (imageIndex !== -1) {
      if (captionIndex > -1) {
        const start = $head.start();
        if (captionIndex > imageIndex) {
          // when caption is below the image
          if (start === $head.pos) {
            // selection is at the end of the caption, we create a new paragraph below
            const found = findParentNodeOfType(state.schema.nodes[nodeNames.figure])(
              state.selection,
            );
            if (found) {
              dispatch(state.tr.setSelection(NodeSelection.create(state.doc, found.pos)));
              return true;
            }
            return false;
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
  if ($head.parent.type.name !== nodeNames.figcaption) return false;
  // We are in a figure caption!!
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
    // TODO: if the figure caption is the same this is not going to work!!
    if (child.eq(figcaption)) {
      captionIndex = i;
    }
  });

  if (!view || !dispatch) {
    return false;
  }

  // TODO: I think this should work regardless of image.
  // TODO: this needs to also work with iframe, table... code...
  // TODO: maybe parentOffset of the caption??
  if (imageIndex !== -1) {
    if (captionIndex > -1) {
      const start = $head.start();
      const end = $head.end();
      const { depth } = $head;
      if (captionIndex > imageIndex) {
        // when caption is below the image
        if (end === $head.pos) {
          // selection is at the end of the caption, we create a new paragraph below
          view.dispatch(insertParagraphAndSelect(view, end + depth));
        } else {
          selectParent(view, start);
        }
        return true;
      }
      // when caption is above the image
      if ($head.pos === start) {
        view.dispatch(insertParagraphAndSelect(view, start - depth));
      } else {
        selectParent(view, start);
      }
      return true;
    }
    // shouldn't reach here since caption should exsits in the figure
    return false;
  }
  return false;
};
