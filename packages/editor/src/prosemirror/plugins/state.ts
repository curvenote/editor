import { findParentNodeOfTypeClosestToPos } from '@curvenote/prosemirror-utils';
import type { EditorState, Transaction } from 'prosemirror-state';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const key = new PluginKey('state');

export const getPluginState = (state?: EditorState | null): boolean => {
  if (state == null) return false;
  const plugin = key.get(state);
  return plugin?.getState(state) ?? false;
};

function getSelectedBlockState(state: EditorState) {
  const result = findParentNodeOfTypeClosestToPos(state.selection.$from, state.schema.nodes.block);
  return result;
}

function getState(state: EditorState) {
  return {
    selectedBlock: getSelectedBlockState(state),
  };
}

function findParentBlock(state: EditorState) {
  return findParentNodeOfTypeClosestToPos(state.selection.$from, state.schema.nodes.block);
}

function createDecorations(state: EditorState) {
  const parentBlock = findParentBlock(state);
  if (!parentBlock) return DecorationSet.empty;
  // console.log('parentBlock', parentBlock, state.selection.$from);
  return DecorationSet.create(state.doc, [
    Decoration.widget(
      parentBlock.start,
      (() => {
        const dom = document.createElement('div');
        console.log('creating new node');
        dom.innerHTML = 'Decoration Block Controls?';
        return dom;
      })(),
    ),
  ]);
}

export const statePlugin = (): Plugin => {
  const plugin: Plugin = new Plugin({
    key,
    props: {
      decorations(state) {
        return this.getState(state).decorations;
      },
      handleDOMEvents: {
        mouseover(this, view, event) {
          // console.log('mouseenter', view.posAtDOM(event.target as HTMLElement, 0));
        },
        mouseout(this, view, event) {
          // console.log('mouseleave', view.posAtDOM(event.target as HTMLElement, 0));
        },
      },
    },
    state: {
      init: (config, state) => {
        const parentBlock = findParentBlock(state);
        if (!parentBlock) return { decorations: DecorationSet.empty, parentBlock: null };
        // console.log('plugin init config', {
        //   decorations: createDecorations(state),
        //   parentBlock: parentBlock,
        // });
        return { decorations: createDecorations(state), parentBlock: parentBlock };
      },
      apply(tr, value, oldState, newState) {
        const prevPluginState: any = plugin.getState(oldState);
        if (!tr.docChanged) {
          return {
            decorations: createDecorations(newState),
            parentBlock: prevPluginState.parentBlock,
          };
        }
        const { parentBlock, decorations } = prevPluginState;
        const newParentBlockSearchResult = findParentBlock(newState);
        console.log('compare', newParentBlockSearchResult, parentBlock);
        // TODO: how to compare whether the block has changed
        if (newParentBlockSearchResult?.node.eq(parentBlock.node)) {
          // update decorations
          console.log('updating ');
          return {
            decorations: createDecorations(newState),
            parentBlock,
          };
        }
        // create new decorations
        return {
          decorations: createDecorations(newState),
          parentBlock: newParentBlockSearchResult,
        };
      },
      toJSON(state) {
        return state;
      },
    },
  });
  return plugin;
};
