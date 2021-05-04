import { Schema } from 'prosemirror-model';
import { AppThunk } from '../../types';
import { getSuggestion } from '../selectors';
import { LinkResult } from '../types';
import { opts, SearchContext } from '../../../connect';
import { insertInlineNode } from '../../actions/editor';

let context: SearchContext | null = null;

const keysToresults = async (keys: string[]) => (
  (await Promise.all(keys?.map((k) => opts.citationKeyToJson(k))))
    .filter((r) => r != null) as LinkResult[]
);

export const startingSuggestions = async () => {
  context = await opts.createCitationSearch();
  const results = await keysToresults(context?.ids ?? []);
  return results;
};

export function chooseSelection(result: LinkResult): AppThunk<boolean> {
  return (dispatch, getState) => {
    const { view, range: { from, to } } = getSuggestion(getState());
    if (view == null) return false;
    const { tr } = view.state;
    view.dispatch(tr.insertText('', from, to));
    dispatch(insertInlineNode(view.state.schema.nodes.cite, { key: result.uid }));
    return true;
  };
}

export function filterResults(
  schema: Schema, search: string, callback: (results: LinkResult[]) => void,
): void {
  if (!search) {
    setTimeout(async () => {
      callback(await keysToresults(context?.ids ?? []));
    }, 1);
    return;
  }
  // This lets the keystroke go through:
  setTimeout(async () => {
    const results = context?.search(search as string) ?? [];
    const links = await keysToresults(results);
    callback(links);
  }, 1);
}
