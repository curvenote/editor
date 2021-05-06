import React, { useEffect, useRef } from 'react';
import { EditorView } from 'prosemirror-view';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';
import { EditorState } from 'prosemirror-state';
import { opts } from '../connect';
import { createEditorView } from '../prosemirror';
import {
  Dispatch, State, actions, selectors,
} from '../store';

type Props = {
  stateKey: any;
  viewId: string;
  autoUnsubscribe?: boolean;
};

const Editor = (props: Props) => {
  const { stateKey, viewId, autoUnsubscribe } = props;

  const dispatch = useDispatch<Dispatch>();

  const editorEl = useRef<HTMLDivElement>(null);
  const editorView = useRef<EditorView>();

  const editorState = useSelector(
    (state: State) => selectors.getEditorState(state, stateKey)?.state,
  );
  const focused = useSelector(
    (state: State) => (selectors.isEditorViewFocused(state, stateKey, viewId)),
  );

  // Create editorView
  useEffect(() => {
    if (editorView.current || !editorEl.current || !editorState) return;
    const doUpdateState = (next: EditorState) => (
      dispatch(actions.updateEditorState(stateKey, viewId, next))
    );
    const updateState = opts.throttle > 0 ? throttle(doUpdateState, opts.throttle) : doUpdateState;
    editorView.current = createEditorView(
      editorEl.current,
      editorState,
      (tr) => {
        const view = editorView.current as EditorView;
        const mtr = opts.modifyTransaction(stateKey, viewId, view.state, tr);
        const next = view.state.apply(mtr);
        updateState(next);
        // Immidiately update the view.
        // This is important for properly handling selections.
        // Cannot use react event loop here.
        editorView.current?.updateState(next);
      },
    );
    editorView.current.dom.id = viewId;
    (editorView.current.dom as HTMLElement).onfocus = () => {
      dispatch(actions.focusEditorView(viewId, true));
    };
    (editorView.current.dom as HTMLElement).onblur = () => {
      dispatch(actions.focusEditorView(viewId, false));
    };
    dispatch(actions.subscribeView(stateKey, viewId, editorView.current));
  }, [editorView.current == null, editorEl.current == null, editorState == null]);

  // Unsubscribe when it goes away
  useEffect(() => () => {
    if (autoUnsubscribe && editorView.current) {
      dispatch(actions.unsubscribeView(stateKey, viewId));
    }
  }, []);

  // Handle an external focus event:
  useEffect(() => {
    if (editorEl.current == null) return;
    if (!focused) {
      (editorView.current?.dom as HTMLElement)?.blur();
      return;
    }
    const subEditors = editorEl.current.getElementsByClassName('ProseMirror-focused');
    if (subEditors.length > 0) return;
    editorView.current?.focus();
  }, [focused]);

  return <div ref={editorEl} />;
};

Editor.defaultProps = {
  autoUnsubscribe: true,
};

export default Editor;
