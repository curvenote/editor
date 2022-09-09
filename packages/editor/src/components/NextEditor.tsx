import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Dispatch, State, Store } from '../store';
import { actions, selectors } from '../store';
import { createEditor, Editor } from '../editor';

type Props = {
  editor: Editor;
  stateKey: string;
  // for redux, keep for now
  viewId: string;
  initialContent: string;
};

const Editor = (props: Props) => {
  const { editor, initialContent, stateKey, viewId } = props;

  const [editorDom, setEditorDom] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((el) => setEditorDom(el), []);

  useEffect(() => {
    if (!editorDom || !editor) return;
    editor.init(editorDom, { content: initialContent, stateKey, viewId });
    return () => {
      editor.destroy();
    };
  }, [editorDom, editor]);

  return <div ref={ref} />;
};

export default Editor;
