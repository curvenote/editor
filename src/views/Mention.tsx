import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { makeStyles, createStyles } from '@material-ui/core';

export type MentionResult = { id?: string; name?: string; email?: string; error?: boolean };

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      padding: '2px 4px',
    },
  }),
);

function Mention({ label, user }: { label: string; user: string }) {
  const classes = useStyles();
  return <span className={classes.root}>{`${label} user - ${user}`}</span>;
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

    ReactDOM.render(<Mention label={node.attrs.label} user={node.attrs.user} />, wrapper);
    this.dom = wrapper;
  }
}
