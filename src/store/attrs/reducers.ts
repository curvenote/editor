import {
  ATTRIBUTES_SHOW_EDITOR,
  AttributesState,
  AttributesActionTypes,
} from './types';

const initialState: AttributesState = {
  showAttributeEditor: false,
  attributePos: { top: 0, left: 0 },
};

const AttributesReducer = (
  state = initialState,
  action: AttributesActionTypes,
): AttributesState => {
  switch (action.type) {
    case ATTRIBUTES_SHOW_EDITOR: {
      // TODO: Move this to the action
      const { show, dom } = action.payload;
      const pos = { top: 0, left: 0 };
      if (dom) {
        const rect = dom.getBoundingClientRect();
        pos.top = (rect.top) < window.innerHeight - 300 - 50
          ? rect.bottom + 10
          : rect.top - 300 - 10;
        pos.left = rect.left;
      }
      return {
        ...state,
        showAttributeEditor: show,
        attributePos: pos,
      };
    }
    default:
      return state;
  }
};

export default AttributesReducer;
