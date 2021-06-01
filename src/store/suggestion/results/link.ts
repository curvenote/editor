import { Schema } from 'prosemirror-model';
import { AppThunk } from '../../types';
import { getSuggestion } from '../selectors';
import { LinkKind, LinkResult } from '../types';
import { opts, SearchContext } from '../../../connect';
import { insertInlineNode } from '../../actions/editor';

let context: SearchContext | null = null;

export const startingSuggestions = async (search: string, create = true) => {
  if (create) {
    context = await opts.createLinkSearch();
  }
  const results = context?.search(search) ?? [];
  return results;
};

export function chooseSelection(result: LinkResult): AppThunk<boolean> {
  return (dispatch, getState) => {
    const { view, range: { from, to } } = getSuggestion(getState());
    if (view == null) return false;
    view.dispatch(view.state.tr.insertText('', from, to));
    switch (result.kind) {
      case LinkKind.cite: {
        const citeAttrs = { key: result.uid, inline: result.content };
        return dispatch(insertInlineNode(view.state.schema.nodes.cite, citeAttrs));
      }
      case LinkKind.link: {
        const { tr } = view.state;
        const text = result.content;
        tr.insertText(`${text} `, from);
        const mark = view.state.schema.marks.link.create({
          href: result.uid,
          title: result.alt ?? '',
          kind: result.linkKind ?? '',
        });
        view.dispatch(tr.addMark(from, from + text.length, mark));
        return true;
      }
      case LinkKind.ref:
        return dispatch(insertInlineNode(view.state.schema.nodes.ref, { key: result.uid }));
      default:
        return false;
    }
  };
}

export function filterResults(
  schema: Schema, search: string, callback: (results: LinkResult[]) => void,
): void {
  // This lets the keystroke go through:
  setTimeout(async () => {
    const results = context?.search(search as string) ?? [];
    callback(results);
  }, 1);
}
