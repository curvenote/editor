import { schemas } from '@curvenote/schema';
import { Schema } from 'prosemirror-model';
import { getSuggestionEditorState } from '../selectors';
import { AppThunk } from '../../types';

export function chooseSelection(result: schemas.MentionNodeAttrState): AppThunk<void> {
  return (dispatch, getState) => {
    const {
      view,
      range: { from, to },
    } = getSuggestionEditorState(getState());
    if (!view) return;

    const schema = view.state.schema as Schema;
    const { tr } = view.state;
    console.log('choose select', { schema, result });
    view.dispatch(
      tr.replaceRangeWith(
        from,
        to,
        schema.nodes.mention.create({ label: result.label, user: result.user }),
      ),
    );
  };
}
