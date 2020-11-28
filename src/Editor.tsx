import React, {
  useEffect, useRef, useState, CSSProperties,
} from 'react';
import { EditorView } from 'prosemirror-view';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { createEditorView } from './prosemirror';
import {
  Dispatch, State, actions, selectors,
} from './store';

const prompts = [
  'Type \'/\' for commands, or just start writing!',
  'Type \':\' for emotion',
  'Type \'$$\' to create an equation',
  'Type \'> \' to create a quote',
  'Type \'* \' for a list',
  'Type \'1. \' for a numbered list',
  'Type \'{{ 1 + 1 }}\' to display 2',
  'Type \'# \' for a header',
  'Type \'### \' for a smaller header',
  'Type \'`code`\' to insert code',
  'Type \'```\' to create a code block',
  'Type \'---\' to create a divider',
];
const promptStyle: CSSProperties = {
  margin: 0, position: 'absolute', opacity: 0.4, left: 40, userSelect: 'none',
};

type Props = {
  stateKey: string;
};

const Editor = (props: Props) => {
  const { stateKey } = props;

  const dispatch = useDispatch<Dispatch>();

  const [viewId] = useState(uuid());
  const editorEl = useRef<HTMLDivElement>(null);
  const editorView = useRef<EditorView>();

  const hasContent = true;

  const editorState = useSelector(
    (state: State) => selectors.getEditorState(state, stateKey),
  );
  const focused = useSelector(
    (state: State) => (selectors.isEditorViewFocused(state, stateKey, viewId)),
  );

  const [prompt, setPrompt] = useState(prompts[0]);
  useEffect(() => setPrompt(prompts[Math.floor(Math.random() * prompts.length)]), [hasContent]);

  // Create editorView
  useEffect(() => {
    if (editorView.current || !editorEl.current || !editorState) return;
    editorView.current = createEditorView(
      editorEl.current,
      editorState,
      (tr) => {
        const view = editorView.current as EditorView;
        const next = view.state.apply(tr);
        dispatch(actions.updateProsemirrorState(stateKey, viewId, next));
        // Immidiately update the view.
        // This is important for properly handling selections.
        // Cannot use react event loop here.
        editorView.current?.updateState(next);
      },
    );
    (editorView.current.dom as HTMLElement).onfocus = () => {
      dispatch(actions.focusEditorView(stateKey, viewId, true));
    };
    (editorView.current.dom as HTMLElement).onblur = () => {
      dispatch(actions.focusEditorView(stateKey, viewId, false));
    };
    dispatch(actions.subscribeView(stateKey, viewId, editorView.current));
    setPrompt(prompts[0]);
  }, [editorView.current == null, editorEl.current == null, editorState == null]);

  // Unsubscribe when it goes away
  useEffect(() => () => {
    if (editorView.current) {
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

  return (
    <div>
      {!hasContent && (<p style={promptStyle}>{prompt}</p>)}
      <div ref={editorEl} />
    </div>
  );
};

export default Editor;
