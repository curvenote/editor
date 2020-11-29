import {
  AttributesActionTypes, ATTRIBUTES_SHOW_EDITOR,
} from './types';

// TODO: Improve this action to be a Thunk that figures out the dom element
// Should be able to open the attribute editor without knowing the view up front
export function setAttributeEditor(show: boolean, dom?: Node | null): AttributesActionTypes {
  return {
    type: ATTRIBUTES_SHOW_EDITOR,
    payload: { show, dom: (dom ?? null) as Element | null },
  };
}
