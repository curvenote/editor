import type { Node } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import React from 'react';

export const ProsemirrorContext = React.createContext<{
  viewCtx?: { view: EditorView; state: EditorState };
  nodeCtx?: { node: Node; getPos: () => number };
}>({});
