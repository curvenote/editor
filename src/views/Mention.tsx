import React from 'react';
import ReactDOM from 'react-dom';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import CloseIcon from '@material-ui/icons/Close';
import { Chip } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

export type MentionResult = { id?: string; name?: string; email?: string; error?: boolean };

function Mention({ label, user, onDelete }: { label: string; user: string; onDelete: () => void }) {
  return (
    <Chip
      icon={<PersonIcon />}
      label={`${label} user - ${user}`}
      variant="outlined"
      onDelete={onDelete}
      deleteIcon={<CloseIcon />}
    />
  );
}

export default class MentionView {
  node: Node;

  view: EditorView;

  getPos: boolean | (() => number);

  dom: HTMLSpanElement;

  constructor(node: Node, view: EditorView, getPos: boolean | (() => number)) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    const wrapper = document.createElement('span');
    ReactDOM.render(
      <Mention
        onDelete={() => {
          const {
            state: { tr },
            dispatch,
          } = this.view;
          if (typeof getPos === 'boolean') return;
          const pos = getPos();
          dispatch(tr.delete(pos, pos + node.nodeSize));
        }}
        label={node.attrs.label}
        user={node.attrs.user}
      />,
      wrapper,
    );
    this.dom = wrapper;
  }
}
