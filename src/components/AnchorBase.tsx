/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { connectAnchorBase, disconnectAnchor } from '../store/ui/actions';
import { isSidenoteSelected } from '../store/ui/selectors';
import { Dispatch, State } from '../store';
import { getDoc } from './utils';


/**
 * AnchorBase Props
 */
type Props = {
  anchor: string;
  className?: string;
  children: React.ReactNode;
  /** when true (default) the component will disconnect from the store on unmount*/
  autoDisconnect?: boolean;
};


export const AnchorBase = (props: Props) => {
  const {
    anchor, children, className, autoDisconnect,
  } = props;
  const dispatch = useDispatch<Dispatch>();
  const [doc, setDoc] = useState<string>();
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref || !autoDisconnect) return () => null;
    return () => {
      const parentDoc = doc ?? getDoc(ref);
      return dispatch(disconnectAnchor(parentDoc, ref));
    };
  }, [doc, ref, autoDisconnect]);

  const selected = useSelector((state: State) => isSidenoteSelected(state, doc, anchor));
  const onRef = useCallback((el: HTMLDivElement) => {
    setRef(el);
    const parentDoc = getDoc(el);
    if (parentDoc) {
      setDoc(parentDoc);
      dispatch(connectAnchorBase(parentDoc, anchor, el));
    }
  }, []);
  const classes = classNames({ selected, [className ?? '']: Boolean(className) });
  return (
    <div className={classes} ref={onRef}>
      {children}
    </div>
  );
};

AnchorBase.defaultProps = {
  className: undefined,
  autoDisconnect: true,
  refs: undefined,
};

export default AnchorBase;
