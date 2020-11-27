import React, {
  useEffect, useRef, useState, CSSProperties,
} from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { v4 as uuid } from 'uuid';
import { getEditorView } from './prosemirror';

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
  focused: boolean;
  hasContent: boolean;
  state: EditorState | null;
  onFocus: (focused: boolean) => void;
  onEdit: (view: EditorView, tr: Transaction, scroll: number) => EditorState;
  subscribeView: (id: string, view: EditorView) => void;
  unsubscribeView: (id: string) => void;
};

const Editor = (props: Props) => {
  const {
    focused, state,
    onFocus, onEdit,
    subscribeView, unsubscribeView,
    hasContent,
  } = props;

  const [id] = useState(uuid());
  const editorEl = useRef<HTMLDivElement>(null);
  const editorView = useRef<EditorView>();

  const [prompt, setPrompt] = useState(prompts[0]);
  useEffect(() => setPrompt(prompts[Math.floor(Math.random() * prompts.length)]), [hasContent]);

  // The editor is only created once, so it needs the up to date callbacks.
  const call = useRef({ onFocus, onEdit });
  const maybeFocus = (focus: boolean) => { if (focused !== focus) onFocus(focus); };
  useEffect(() => { call.current = { onFocus: maybeFocus, onEdit }; }, [maybeFocus, onEdit]);

  // Create editor view.
  useEffect(() => {
    console.log('HI!')
    if (editorView.current || !editorEl.current || !state) return;
    console.log('HI1!')
    editorView.current = getEditorView(
      editorEl.current,
      state,
      (tr) => {
        call.current.onFocus(true);
        const next = call.current.onEdit(editorView.current as EditorView, tr, window.scrollY);
        editorView.current?.updateState(next);
      },
    );
    (editorView.current.dom as HTMLElement).onblur = () => call.current.onFocus(false);
    // The reducer must immidiately update the view.
    // This is important for properly handling selections.
    // Cannot use react event loop here.
    subscribeView(id, editorView.current);
    setPrompt(prompts[0]);
  }, [editorEl, state]);
  useEffect(() => () => { if (editorView.current) unsubscribeView(id); }, []);

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
