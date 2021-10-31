import { MarkType } from 'prosemirror-model';
import { DecorationSet } from 'prosemirror-view';

export type Options = {
  markType?: MarkType;
};

export type CodemarkState = {
  decorations?: DecorationSet;
  side?: -1;
  next?: true; // Trigger a look up on the next render
  check?: true; // Check if the cursor should be moved
} | null;

export type CursorMetaTr =
  | {
      action: 'add';
      pos: number;
      side?: -1;
    }
  | { action: 'remove' }
  | { action: 'next' };
