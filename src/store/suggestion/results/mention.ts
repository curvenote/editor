import { Nodes } from '@curvenote/schema';
import { Schema } from 'prosemirror-model';
import { selectSuggestionState } from '../selectors';
import { AppThunk } from '../../types';

export function chooseSelection(result: Nodes.Mention.Attrs): AppThunk<void> {
  return (dispatch, getState) => {
    const {
      view,
      range: { from, to },
    } = selectSuggestionState(getState());
    if (!view) return;

    const schema = view.state.schema as Schema;
    const { tr } = view.state;
    view.dispatch(
      tr.replaceRangeWith(
        from,
        to,
        schema.nodes.mention.create({ label: result.label, user: result.user }),
      ),
    );
  };
}
