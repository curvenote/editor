import { useSelector } from 'react-redux';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { getEditorState } from '../../store/state/selectors';
import { State } from '../../store';

export function useInlineActionNode(stateId: any) {
  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  if (!selection || !isNodeSelection(selection)) return null;
  const { node } = selection as NodeSelection;
  if (!isNodeSelection(selection)) return null;
  return node;
}
