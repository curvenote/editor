import type { EditorState, Transaction } from 'prosemirror-state';
import { Plugin, PluginKey } from 'prosemirror-state';

const key = new PluginKey('editable');

export const isEditable = (state?: EditorState | null): boolean => {
  if (state == null) return false;
  const plugin = key.get(state);
  return plugin?.getState(state) ?? false;
};

export const setEditable = (state: EditorState, tr: Transaction, editable: boolean): Transaction =>
  tr.setMeta(key.get(state) as Plugin, editable);

export const editablePlugin = (startEditable: boolean): Plugin => {
  const plugin: Plugin = new Plugin({
    key,
    state: {
      init: () => startEditable,
      apply(tr, value, oldState) {
        // See it the transaction metadata is changing, otherwise use old state
        const editable = tr.getMeta(plugin) ?? plugin.getState(oldState);
        return editable;
      },
    },
  });
  return plugin;
};
