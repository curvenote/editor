import type { AttributesActionTypes } from './types';
import { ATTRIBUTES_SHOW_EDITOR } from './types';
import type { AppThunk } from '../types';

export const openAttributeEditor =
  (show: boolean, pos: number, dom: Element): AppThunk<void> =>
  (dispatch) => {
    const location = { top: 0, left: 0 };
    const rect = dom.getBoundingClientRect();
    location.top =
      rect.top < window.innerHeight - 300 - 50 ? rect.bottom + 10 : rect.top - 300 - 10;
    location.left = rect.left;
    dispatch({
      type: ATTRIBUTES_SHOW_EDITOR,
      payload: { show, location, pos },
    } as AttributesActionTypes);
  };

export function closeAttributeEditor(): AttributesActionTypes {
  return {
    type: ATTRIBUTES_SHOW_EDITOR,
    payload: { show: false, location: null, pos: 0 },
  };
}
