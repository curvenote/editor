import Fuse from 'fuse.js';
import type { Schema } from 'prosemirror-model';
import type { AppThunk } from '../../types';
import { selectSuggestionState } from '../selectors';
import type { EmojiResult } from '../types';

const options = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: [
    {
      name: 's',
      weight: 0.4,
    },
    {
      name: 'o',
      weight: 0.3,
    },
    {
      name: 'n',
      weight: 0.3,
    },
  ],
};

let fuse: Fuse<EmojiResult> | null = null;

async function getFuse() {
  if (fuse) return fuse;
  const emoji = await import('@curvenote/emoji');
  fuse = new Fuse(emoji.default.emoji, options);
  return fuse;
}

// This is in emoji.default if it needs to be recreated.
// This is now async and broken into modules.
export const startingSuggestions = [
  {
    c: '👍',
    n: 'Thumbs Up',
    s: '+1',
    o: 'thumbsup',
  },
  {
    c: '👎',
    n: 'Thumbs Down',
    s: '-1',
    o: 'thumbsdown',
  },
  {
    c: '😀',
    n: 'Grinning Face',
    s: 'grinning',
    o: ' :D',
  },
  {
    c: '❤️',
    n: 'Red Heart',
    s: 'heart',
    o: ' <3',
  },
  {
    c: '🚀',
    n: 'Rocket',
    s: 'rocket',
    o: '',
  },
  {
    c: '🎉',
    n: 'Party Popper',
    s: 'tada',
    o: '',
  },
  {
    c: '👀',
    n: 'Eyes',
    s: 'eyes',
    o: '',
  },
  {
    c: '😕',
    n: 'Confused Face',
    s: 'confused',
    o: '',
  },
  {
    c: '😛',
    n: 'Face With Tongue',
    s: 'stuck_out_tongue',
    o: ' :p',
  },
];

export function chooseSelection(result: EmojiResult): AppThunk<boolean> {
  return (dispatch, getState) => {
    const {
      view,
      range: { from, to },
    } = selectSuggestionState(getState());
    if (view == null) return false;
    const { tr } = view.state;
    tr.insertText(`${result.c} `, from, to);
    view.dispatch(tr);
    return true;
  };
}

export function filterResults(
  schema: Schema,
  search: string,
  callback: (results: EmojiResult[]) => void,
): void {
  if (search === 'D') {
    callback(startingSuggestions.filter((e) => e.n === 'Grinning Face') as EmojiResult[]);
    return;
  }
  if (search.toUpperCase() === 'P') {
    callback(startingSuggestions.filter((e) => e.n === 'Face With Tongue') as EmojiResult[]);
    return;
  }
  if (search.toUpperCase() === '?') {
    callback(startingSuggestions.filter((e) => e.n === 'Confused Face') as EmojiResult[]);
    return;
  }
  // This lets the keystroke go through:
  setTimeout(async () => {
    const results = (await getFuse())?.search(search as string);
    callback(results?.map((result) => result.item) as EmojiResult[]);
  }, 1);
}
