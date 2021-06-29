import { schemas } from '@curvenote/schema';
import { Plugin, PluginKey } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const key = new PluginKey('prompt');

export interface PromptState {
  prompt: DecorationSet;
}

const getPromptPlugin = (): Plugin<PromptState> => {
  const promptPlugin: Plugin<PromptState> = new Plugin({
    key,
    state: {
      init: () => ({ prompt: DecorationSet.empty } as PromptState),
      apply(tr): PromptState {
        const getParagraph = findParentNode(
          (node) => node.type.name === schemas.nodeNames.paragraph,
        );
        const para = getParagraph(tr.selection);
        if (tr.selection.empty && para && para.node.nodeSize === 2) {
          const deco = Decoration.node(tr.selection.from - 1, tr.selection.to + 1, {
            class: 'prompt',
          });
          return { prompt: new DecorationSet().add(tr.doc, [deco]) };
        }
        return {
          prompt: DecorationSet.empty,
        };
      },
    },
    props: {
      decorations: (state) => promptPlugin.getState(state).prompt,
    },
  });
  return promptPlugin;
};

export default getPromptPlugin;
