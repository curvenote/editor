import { nodeNames } from '@curvenote/schema';
import { Plugin, PluginKey } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils1';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { isEditable } from './editable';

export const key = new PluginKey('prompt');

const getParentIfParagraph = findParentNode((node) => node.type.name === nodeNames.paragraph);

const getPromptPlugin = (): Plugin<DecorationSet> => {
  const promptPlugin: Plugin<DecorationSet> = new Plugin({
    key,
    state: {
      init: () => DecorationSet.empty,
      apply(tr, value: DecorationSet, oldState, newState): DecorationSet {
        if (!isEditable(newState)) return DecorationSet.empty;
        const paragraph = getParentIfParagraph(newState.selection);
        const emptyParagraph = paragraph && paragraph.node.nodeSize === 2;
        if (tr.selection.empty && emptyParagraph) {
          const deco = Decoration.node(tr.selection.from - 1, tr.selection.to + 1, {
            class: 'prompt',
          });
          return DecorationSet.create(tr.doc, [deco]);
        }
        return DecorationSet.empty;
      },
    },
    props: {
      decorations(state) {
        return promptPlugin.getState(state);
      },
    },
  });
  return promptPlugin;
};

export default getPromptPlugin;
