/* eslint-disable react/prop-types */
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { connectComment, disconnectComment, selectComment } from '../store/ui/actions';
import { commentTop, isCommentSelected } from '../store/ui/selectors';
import { Dispatch, State } from '../store';

type Props = {
  docId: string;
  commentId: string;
  children: React.ReactNode;
};

export const CommentContainer = (props: Props) => {
  const { docId, commentId, children } = props;
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => () => { dispatch(disconnectComment(docId, commentId)); }, []);

  const selected = useSelector((state: State) => isCommentSelected(state, docId, commentId));
  const top = useSelector((state: State) => commentTop(state, docId, commentId));
  const onClick = useCallback(() => { dispatch(selectComment(docId, commentId)); }, []);
  const onRef = useCallback(() => { dispatch(connectComment(docId, commentId)); }, []);
  return (
    <div
      id={commentId}
      className={classNames('comment', { selected })}
      onClickCapture={onClick}
      ref={onRef}
      style={{ top }}
    >
      {children}
    </div>
  );
};

export default CommentContainer;
