import type { Selection } from 'prosemirror-state';
import { PluginKey } from 'prosemirror-state';
import type { DecorationSet } from 'prosemirror-view';

export const pluginKey = new PluginKey('autocomplete');

export function inSuggestion(selection: Selection, decorations: DecorationSet) {
  return decorations.find(selection.from, selection.to).length > 0;
}
