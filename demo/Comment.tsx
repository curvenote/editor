import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initEditorState } from '../src/store/actions';
import { v4 } from 'uuid';

export default function Comment(props: any) {
  const ref = useRef(null);
  const [content, setContent] = useState('<p></p>');
  const [isInitialized, setInitialized] = useState(false);
  const [ids, setIds] = useState(() => {
    const id = v4();
    return { id, viewId: `mention-view-${id}`, stateId: `mention-state-${id}` };
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (isInitialized) return;
    dispatch(initEditorState('comment', ids.stateId, true, content, 0));
    setInitialized(true);
  }, [ref]);

  return (
    <div>
      <div ref={ref} />
    </div>
  );
}
