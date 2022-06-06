import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isNodeSelection } from 'prosemirror-utils';
import debounce from 'lodash.debounce';
import { getEditorState } from '../../store/state/selectors';
import { State } from '../../store';
import { getNodeFromSelection } from '../../store/ui/utils';

export function useInlineActionNode(stateId: any) {
  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  if (!selection || !isNodeSelection(selection)) return null;
  return getNodeFromSelection(selection);
}

/**
 * Better Popper Management
 * - update popper position on anchor resizing
 * - batch popper update render
 */
export function usePopper(currentEl: Element | null | undefined) {
  const [popper, setPopper] = useState<any>(null);
  const popperRef = useCallback((popperInstance) => setPopper(popperInstance), []);
  // popper update is debounced
  const updatePopper = useMemo(() => {
    if (!popper) return () => {};
    return debounce(() => {
      if (popper && popper.reference.isConnected) {
        popper.update();
      }
    }, 0);
  }, [popper]); // batch all updatePopper call in a call stack to avoid unnecessary render

  // updates popper when anchor size changes
  useEffect(() => {
    if (!currentEl || !updatePopper) return () => {};
    updatePopper(); // make sure initial position is correct
    const observer = new ResizeObserver(() => {
      updatePopper();
    });
    observer.observe(currentEl);
    return () => {
      observer.disconnect();
    };
  }, [currentEl, updatePopper]);

  return [popperRef];
}
