import { Schema } from 'prosemirror-model';
import { Nodes, RefKind } from '@curvenote/schema';
import { AppThunk } from '../../types';
import { getSuggestion } from '../selectors';
import { LinkResult } from '../types';
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
    const {
      view,
      range: { from, to },
    } = getSuggestion(getState());
    if (view == null) return false;
    view.dispatch(view.state.tr.insertText('', from, to));
    switch (result.kind) {
      case RefKind.cite: {
        const citeAttrs: Nodes.Cite.Attrs = {
          key: result.uid,
          title: result.alt ?? '',
          kind: RefKind.cite,
          text: result.content,
        };
        return dispatch(insertInlineNode(view.state.schema.nodes.cite, citeAttrs));
      }
      case RefKind.link: {
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
      default: {
        const citeAttrs: Nodes.Cite.Attrs = {
          key: result.uid,
          title: result.alt ?? '',
          kind: result.kind,
          text: result.content,
        };
        return dispatch(insertInlineNode(view.state.schema.nodes.cite, citeAttrs));
      }
    }
  };
}

export function filterResults(
  schema: Schema,
  search: string,
  callback: (results: LinkResult[]) => void,
): void {
  // This lets the keystroke go through:
  setTimeout(async () => {
    const results = context?.search(search as string) ?? [];
    callback(results);
  }, 1);
}
