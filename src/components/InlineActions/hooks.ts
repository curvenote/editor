import { useSelector } from 'react-redux';
import { isNodeSelection } from 'prosemirror-utils';
import { getEditorState } from '../../store/state/selectors';
import { State } from '../../store';
import { getNodeFromSelection } from '../../store/ui/utils';

export function useInlineActionNode(stateId: any) {
  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  if (!selection || !isNodeSelection(selection)) return null;
  return getNodeFromSelection(selection);
}
