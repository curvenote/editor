import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Editor from './Editor';
import { getEditorState } from './prosemirror';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';


declare global {
  interface Window {
    [index: string]: any;
  }
}

window.state = getEditorState('<p>Hello world!</p>', 0, true);

const App = () => {
  const [focused, onFocus] = useState(true);
  const [view, setView] = useState<EditorView | null>(null);

  const onEdit = (view: EditorView, tr: Transaction, scroll: number) => {
    console.log(tr)
    const next = view.state.apply(tr);
    window.state = next;
    return next;
    // view?.updateState(next);
  }

  const subscribeView = (id: string, view: EditorView) => setView(view);
  const unsubscribeView = (id: string) => null;

  return (
    <Editor
      hasContent
      focused={focused}
      state={window.state}
      onFocus={() => null}
      onEdit={onEdit}
      subscribeView={subscribeView}
      unsubscribeView={unsubscribeView}
    />
  );
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
