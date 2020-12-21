/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  connectAnchor, disconnectAnchor, selectAnchor,
} from '../store/ui/actions';
import { isCommentSelected } from '../store/ui/selectors';
import { Dispatch, State } from '../store';
import { getDoc } from './utils';

type Props = {
  comment: string;
  children: React.ReactNode;
};

export const CommentAnchor = (props: Props) => {
  const {
    comment, children,
  } = props;
  const dispatch = useDispatch<Dispatch>();
  const [doc, setDoc] = useState<string>();
  const [ref, setRef] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (ref == null || doc == null) return () => {};
    return () => dispatch(disconnectAnchor(doc, ref));
  }, [doc, ref]);

  const selected = useSelector((state: State) => isCommentSelected(state, doc, comment));
  const onClick = useCallback(() => { dispatch(selectAnchor(doc, ref)); }, [doc, ref]);
  const onRef = useCallback((el: HTMLSpanElement) => {
    setRef(el);
    const parentDoc = getDoc(el);
    if (parentDoc) {
      setDoc(parentDoc);
      dispatch(connectAnchor(parentDoc, comment, el));
    }
  }, []);
  return (
    <span className={classNames('anchor', { selected })} onClickCapture={onClick} ref={onRef}>
      {children}
    </span>
  );
};

export default CommentAnchor;
