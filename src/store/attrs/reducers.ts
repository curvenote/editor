import { ATTRIBUTES_SHOW_EDITOR, AttributesState, AttributesActionTypes } from './types';

const initialState: AttributesState = {
  show: false,
  pos: 0,
  location: { top: 0, left: 0 },
};

const AttributesReducer = (
  state = initialState,
  action: AttributesActionTypes,
): AttributesState => {
  switch (action.type) {
    case ATTRIBUTES_SHOW_EDITOR: {
      // TODO: Move this to the action
      const { show, location, pos } = action.payload;
      return {
        ...state,
        show,
        pos,
        location,
      };
    }
    default:
      return state;
  }
};

export default AttributesReducer;
