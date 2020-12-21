/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  connectAnchor, disconnectAnchor, selectAnchor,
} from '../store/ui/actions';
import { isCommentSelected } from '../store/ui/selectors';
import { Dispatch, State } from '../store';

type Props = {
  docId: string;
  commentId: string;
  children: React.ReactNode;
};

export const CommentAnchor = (props: Props) => {
  const {
    docId, commentId, children,
  } = props;
  const dispatch = useDispatch<Dispatch>();
  const [ref, setRef] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (ref == null) return () => {};
    return () => dispatch(disconnectAnchor(docId, ref));
  }, [ref]);

  const selected = useSelector((state: State) => isCommentSelected(state, docId, commentId));
  const onClick = useCallback(() => { dispatch(selectAnchor(docId, ref)); }, [ref]);
  const onRef = useCallback((el: HTMLSpanElement) => {
    setRef(el);
    dispatch(connectAnchor(docId, commentId, el));
  }, []);
  return (
    <span className={classNames('anchor', { selected })} onClickCapture={onClick} ref={onRef}>
      {children}
    </span>
  );
};

export default CommentAnchor;
