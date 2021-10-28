import { getSuggestion } from '../../selectors';
import { AppThunk } from '../../types';
import { MentionResult } from '../types';

export const chooseSelection = (result: MentionResult): AppThunk<boolean> => {
  return (dispatch, getState) => {
    const {
      view,
      range: { from, to },
    } = getSuggestion(getState());
    if (view == null) return false;
    const removeText = () => {
      const { tr } = view.state;
      tr.insertText('', from, to);
      view.dispatch(tr);
      return true;
    };
    console.log('select?', result);
    removeText();
    return true;
  };
};
