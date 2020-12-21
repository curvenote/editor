import {
  UIActionTypes, UI_SELECT_COMMENT, UI_CONNECT_COMMENT,
  DocCommentState, UI_CONNECT_ANCHOR, UI_SELECT_ANCHOR, UI_DISCONNECT_ANCHOR,
  UI_DESELECT_COMMENT, UI_DISCONNECT_COMMENT,
} from './types';


const docReducer = (
  state: DocCommentState,
  action: UIActionTypes,
): DocCommentState => {
  if (state == null) {
    const { docId } = action.payload;
    // eslint-disable-next-line no-param-reassign
    state = {
      id: docId,
      selectedComment: null,
      selectedAnchor: null,
      comments: {},
      anchors: {},
    };
  }
  switch (action.type) {
    case UI_CONNECT_COMMENT: {
      const { commentId } = action.payload;

      const prevComment = state.comments[commentId];

      return {
        ...state,
        comments: {
          ...state.comments,
          [commentId]: {
            ...prevComment,
            id: commentId,
            baseAnchors: [...(prevComment?.baseAnchors ?? [])],
            inlineAnchors: [...(prevComment?.inlineAnchors ?? [])],
          },
        },
      };
    }
    case UI_DISCONNECT_COMMENT: {
      const { commentId } = action.payload;
      const comment = state.comments[commentId];
      if (!comment) return state;

      const comments = { ...state.comments };
      delete comments[comment.id];

      return {
        ...state,
        comments,
      };
    }
    case UI_CONNECT_ANCHOR: {
      const { commentId, anchorId, element } = action.payload;

      const prevComment = state.comments[commentId];

      return {
        ...state,
        comments: {
          ...state.comments,
          [commentId]: {
            ...prevComment,
            inlineAnchors: [anchorId, ...(prevComment?.inlineAnchors ?? [])],
          },
        },
        anchors: {
          ...state.anchors,
          [anchorId]: {
            id: anchorId,
            comment: commentId,
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

      const comment = state.comments[anchor.comment];

      return {
        ...state,
        comments: {
          ...state.comments,
          [anchor.comment]: {
            ...comment,
            inlineAnchors: [...(comment?.inlineAnchors ?? [])].filter((a) => a !== anchorId),
          },
        },
        anchors,
      };
    }
    case UI_SELECT_COMMENT: {
      const { commentId } = action.payload;

      const prevComment = state.comments[commentId];
      return {
        ...state,
        selectedComment: commentId,
        selectedAnchor: prevComment.inlineAnchors?.[0] ?? prevComment.baseAnchors?.[0] ?? null,
        comments: {
          ...state.comments,
          [commentId]: {
            ...prevComment,
            id: commentId,
            baseAnchors: [...(prevComment?.baseAnchors ?? [])],
            inlineAnchors: [...(prevComment?.inlineAnchors ?? [])],
          },
        },
      };
    }
    case UI_SELECT_ANCHOR: {
      const { anchorId } = action.payload;
      const anchor = state.anchors[anchorId];
      if (!anchor) return state;
      const comment = state.comments[anchor.comment];
      // Bring the selected anchor to the front
      const anchors = [
        anchorId, ...[...(comment?.inlineAnchors ?? [])].filter((a) => a !== anchorId),
      ];
      return {
        ...state,
        comments: {
          ...state.comments,
          [anchor.comment]: {
            ...comment,
            inlineAnchors: anchors,
          },
        },
        selectedAnchor: anchorId,
        selectedComment: anchor.comment,
      };
    }
    case UI_DESELECT_COMMENT: {
      return {
        ...state,
        selectedAnchor: null,
        selectedComment: null,
      };
    }
    default:
      return state;
  }
};

export default docReducer;
