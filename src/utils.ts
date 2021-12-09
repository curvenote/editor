import { PluginKey, Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export const DEFAULT_ID = 'autocomplete';
export const DEFAULT_DECO_ATTRS = { class: DEFAULT_ID };

export const pluginKey = new PluginKey(DEFAULT_ID);

export function inSuggestion(selection: Selection, decorations: DecorationSet) {
  return decorations.find(selection.from, selection.to).length > 0;
}
