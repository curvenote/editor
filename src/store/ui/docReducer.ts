import {
  UIActionTypes,
  UI_SELECT_SIDENOTE,
  UI_CONNECT_SIDENOTE,
  DocState,
  UI_CONNECT_ANCHOR,
  UI_SELECT_ANCHOR,
  UI_DISCONNECT_ANCHOR,
  UI_DESELECT_SIDENOTE,
  UI_DISCONNECT_SIDENOTE,
  UI_CONNECT_ANCHOR_BASE,
  ANCHOR_BASE,
  UI_REPOSITION_SIDENOTES,
  UI_RESET_ALL_SIDENOTES,
} from "./types";

const docReducer = (state: DocState, action: UIActionTypes): DocState => {
  if (state == null && action.type !== UI_RESET_ALL_SIDENOTES) {
    const { docId } = action.payload;
    // eslint-disable-next-line no-param-reassign
    state = {
      id: docId,
      selectedSidenote: null,
      selectedAnchor: null,
      sidenotes: {},
      anchors: {},
    };
  }
  switch (action.type) {
    case UI_REPOSITION_SIDENOTES:
      return state;
    case UI_CONNECT_SIDENOTE: {
      const { sidenoteId, baseId } = action.payload;
      const baseIds = baseId ? [baseId] : [];
      const prevSidenote = state.sidenotes[sidenoteId];
      return {
        ...state,
        sidenotes: {
          ...state.sidenotes,
          [sidenoteId]: {
            ...prevSidenote,
            id: sidenoteId,
            baseAnchors: [...baseIds, ...(prevSidenote?.baseAnchors ?? [])],
            inlineAnchors: [...(prevSidenote?.inlineAnchors ?? [])],
          },
        },
      };
    }
    case UI_DISCONNECT_SIDENOTE: {
      const { sidenoteId } = action.payload;
      const sidenote = state.sidenotes[sidenoteId];
      if (!sidenote) return state;

      const sidenotes = { ...state.sidenotes };
      delete sidenotes[sidenote.id];

      return {
        ...state,
        sidenotes,
      };
    }
    case UI_CONNECT_ANCHOR: {
      const { sidenoteId, anchorId, element } = action.payload;

      const prevSidenote = state.sidenotes[sidenoteId];

      return {
        ...state,
        sidenotes: {
          ...state.sidenotes,
          [sidenoteId]: {
            ...prevSidenote,
            inlineAnchors: [anchorId, ...(prevSidenote?.inlineAnchors ?? [])],
          },
        },
        anchors: {
          ...state.anchors,
          [anchorId]: {
            id: anchorId,
            sidenote: sidenoteId,
            element,
          },
        },
      };
    }
    case UI_CONNECT_ANCHOR_BASE: {
      const { anchorId, element } = action.payload;
      return {
        ...state,
        anchors: {
          ...state.anchors,
          [anchorId]: {
            id: anchorId,
            sidenote: ANCHOR_BASE,
            element,
          },
        },
      };
    }
    case UI_DISCONNECT_ANCHOR: {
      const { anchorId } = action.payload;
      const anchor = state.anchors[anchorId];
      if (!anchor) return state;

      const anchors = { ...state.anchors };
      delete anchors[anchor.id];

      const sidenote = state.sidenotes[anchor.sidenote];

      return {
        ...state,
        sidenotes: {
          ...state.sidenotes,
          [anchor.sidenote]: {
            ...sidenote,
            inlineAnchors: [...(sidenote?.inlineAnchors ?? [])].filter(
              (a) => a !== anchorId
            ),
          },
        },
        anchors,
      };
    }
    case UI_SELECT_SIDENOTE: {
      const { sidenoteId } = action.payload;

      const prevSidenote = state.sidenotes[sidenoteId];
      return {
        ...state,
        selectedSidenote: sidenoteId,
        selectedAnchor:
          prevSidenote?.inlineAnchors?.[0] ??
          prevSidenote?.baseAnchors?.[0] ??
          null,
        sidenotes: {
          ...state.sidenotes,
          [sidenoteId]: {
            ...prevSidenote,
            id: sidenoteId,
            baseAnchors: [...(prevSidenote?.baseAnchors ?? [])],
            inlineAnchors: [...(prevSidenote?.inlineAnchors ?? [])],
          },
        },
      };
    }
    case UI_SELECT_ANCHOR: {
      const { anchorId } = action.payload;
      const anchor = state.anchors[anchorId];
      if (!anchor) return state;
      const sidenote = state.sidenotes[anchor.sidenote];
      // Bring the selected anchor to the front
      const anchors = [
        anchorId,
        ...[...(sidenote?.inlineAnchors ?? [])].filter((a) => a !== anchorId),
      ];
      return {
        ...state,
        sidenotes: {
          ...state.sidenotes,
          [anchor.sidenote]: {
            ...sidenote,
            inlineAnchors: anchors,
          },
        },
        selectedAnchor: anchorId,
        selectedSidenote: anchor.sidenote,
      };
    }
    case UI_DESELECT_SIDENOTE: {
      return {
        ...state,
        selectedAnchor: null,
        selectedSidenote: null,
      };
    }
    default:
      return state;
  }
};

export default docReducer;
