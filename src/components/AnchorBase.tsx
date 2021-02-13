/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { connectAnchorBase, disconnectAnchor } from '../store/ui/actions';
import { isSidenoteSelected } from '../store/ui/selectors';
import { Dispatch, State } from '../store';
import { getDoc } from './utils';

type Props = {
  anchor: string;
  className?: string;
  children: React.ReactNode;
};

export const AnchorBase = (props: Props) => {
  const {
    anchor, children, className,
  } = props;
  const dispatch = useDispatch<Dispatch>();
  const [doc, setDoc] = useState<string>();
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref == null || doc == null) return () => {};
    return () => dispatch(disconnectAnchor(doc, ref));
  }, [doc, ref]);

  const selected = useSelector((state: State) => isSidenoteSelected(state, doc, anchor));
  const onRef = useCallback((el: HTMLDivElement) => {
    setRef(el);
    const parentDoc = getDoc(el);
    if (parentDoc) {
      setDoc(parentDoc);
      dispatch(connectAnchorBase(parentDoc, anchor, el));
    }
  }, []);
  useEffect(() => {
    if (!ref) return () => null;
    return () => {
      const parentDoc = getDoc(ref);
      return dispatch(disconnectAnchor(parentDoc, ref));
    };
  }, [ref]);
  const classes = classNames({ selected, [className ?? '']: Boolean(className) });
  return (
    <div className={classes} ref={onRef}>
      {children}
    </div>
  );
};

AnchorBase.defaultProps = {
  className: undefined,
};

export default AnchorBase;
