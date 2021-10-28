import { getSuggestion } from 'store/selectors';

export interface MentionResult {
  name: string;
  email: string;
  avatar: string;
}

export const chooseSelection = (result: MentionResult) => {
  // const {
  //   view,
  //   range: { from, to },
  // } = getSuggestion(getState());
  // if (view == null) return false;
  // const removeText = () => {
  //   const { tr } = view.state;
  //   tr.insertText('', from, to);
  //   view.dispatch(tr);
  //   return true;
  // };
  // return dispatch((result.name, view, removeText, true));
};
