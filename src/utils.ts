import { PluginKey, Selection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';

export const AUTOCOMPLETE = 'autocomplete';
export const pluginKey = new PluginKey(AUTOCOMPLETE);

export function inSuggestion(selection: Selection, decorations: DecorationSet) {
  return decorations.find(selection.from, selection.to).length > 0;
}
