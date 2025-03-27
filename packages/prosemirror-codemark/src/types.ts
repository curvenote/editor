import type { PluginKey } from 'prosemirror-state';
import type { MarkType } from 'prosemirror-model';

export type Options = {
  markType?: MarkType;
  pluginKey?: string | PluginKey;
};

export type CodemarkState = {
  active?: boolean;
  side?: -1 | 0;
  next?: true; // Move outside of code after next transaction
  click?: true; // When the editor is clicked on
} | null;

export type CursorMetaTr = { action: 'next' } | { action: 'click' };
