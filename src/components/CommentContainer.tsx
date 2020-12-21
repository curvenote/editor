/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { connectComment, disconnectComment, selectComment } from '../store/ui/actions';
import { commentTop, isCommentSelected } from '../store/ui/selectors';
import { Dispatch, State } from '../store';
import { getDoc } from './utils';

type Props = {
  comment: string;
  children: React.ReactNode;
};

export const CommentContainer = (props: Props) => {
  const { comment, children } = props;
  const dispatch = useDispatch<Dispatch>();
  const [doc, setDoc] = useState<string>();

  useEffect(() => () => { dispatch(disconnectComment(doc, comment)); }, []);

  const selected = useSelector((state: State) => isCommentSelected(state, doc, comment));
  const top = useSelector((state: State) => commentTop(state, doc, comment));
  const onClick = useCallback(() => { dispatch(selectComment(doc, comment)); }, [doc]);
  const onRef = useCallback((el: HTMLDivElement) => {
    const parentDoc = getDoc(el);
    if (parentDoc) {
      setDoc(parentDoc);
      dispatch(connectComment(parentDoc, comment));
    }
  }, []);
  return (
    <div
      id={comment}
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
