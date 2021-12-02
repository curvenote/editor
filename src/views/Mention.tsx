import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import CloseIcon from '@material-ui/icons/Close';
import { Chip, makeStyles, createStyles } from '@material-ui/core';

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

function useHover(): [React.MutableRefObject<HTMLElement | null>, boolean] {
  const [value, setValue] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);
        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener('mouseout', handleMouseOut);
        };
      }
    },
    [ref.current], // Recall only if ref changes
  );
  return [ref, value];
}

function Mention({
  label,
  user,
  onHover,
}: {
  label: string;
  user: string;
  onHover: (user: string, isHover: boolean) => void;
}) {
  const classes = useStyles();
  const [ref, isHover] = useHover();
  useEffect(() => {
    onHover(user, isHover);
  }, [isHover, onHover]);
  return <span ref={ref} className={classes.root}>{`${label} user - ${user}`}</span>;
}

function onHover(user: string, isHover: boolean) {
  console.log('hover', { user, isHover });
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
      <Mention label={node.attrs.label} user={node.attrs.user} onHover={onHover} />,
      wrapper,
    );
    this.dom = wrapper;
  }
}
