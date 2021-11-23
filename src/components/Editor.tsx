import React, { useEffect, useRef } from 'react';
import { EditorView } from 'prosemirror-view';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';
import { EditorState, Transaction } from 'prosemirror-state';
import { opts } from '../connect';
import { createEditorView } from '../prosemirror';
import { Dispatch, State, actions, selectors } from '../store';

type Props = {
  stateKey: any;
  viewId: string;
  className?: string;
  autoUnsubscribe?: boolean;
};

const Editor = (props: Props) => {
  const { stateKey, viewId, className, autoUnsubscribe } = props;

  const dispatch = useDispatch<Dispatch>();

  const editorEl = useRef<HTMLDivElement>(null);
  const editorView = useRef<EditorView>();

  const editorState = useSelector(
    (state: State) => selectors.getEditorState(state, stateKey)?.state,
  );

  // Create editorView
  useEffect(() => {
    if (editorView.current || !editorEl.current || !editorState) return;
    const doUpdateState = (next: EditorState, tr: Transaction) =>
      dispatch(actions.updateEditorState(stateKey, viewId, next, tr));
    const updateState = opts.throttle > 0 ? throttle(doUpdateState, opts.throttle) : doUpdateState;
    editorView.current = createEditorView(editorEl.current, editorState, (tr) => {
      const view = editorView.current as EditorView;
      const mtr = opts.modifyTransaction(stateKey, viewId, view.state, tr);
      const next = view.state.apply(mtr);
      updateState(next, mtr);
      // Immidiately update the view.
      // This is important for properly handling selections.
      // Cannot use react event loop here.
      editorView.current?.updateState(next);
    });
    editorView.current.dom.id = viewId;
    if (className) editorView.current.dom.classList.add(...className.split(' '));

    (editorView.current.dom as HTMLElement).onfocus = () => {
      dispatch(actions.selectEditorView(viewId));
    };
    dispatch(actions.subscribeView(stateKey, viewId, editorView.current));
  }, [editorView.current == null, editorEl.current == null, editorState == null]);

  // Unsubscribe when it goes away
  useEffect(
    () => () => {
      if (autoUnsubscribe && editorView.current) {
        dispatch(actions.unsubscribeView(stateKey, viewId));
      }
    },
    [],
  );
  return <div ref={editorEl} />;
};

Editor.defaultProps = {
  autoUnsubscribe: true,
  className: '',
};

export default Editor;
