/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import scrollIntoView from 'scroll-into-view-if-needed';

const HIGHLIGHT_COLOR = '#e8e8e8';


const useStyles = makeStyles(() => createStyles({
  root: {
    padding: 10,
    cursor: 'pointer',
  },
}));

type Props = {
  selected: boolean;
  onClick: () => void;
  onHover: () => void;
  className?: string;
};

const Comment: React.FC<Props> = (props) => {
  const {
    selected, onClick, onHover, children, className,
  } = props;

  const classes = useStyles();

  return (
    <div
      className={`${classes.root} ${className ?? ''}`}
      onClick={onClick}
      onMouseEnter={onHover}
      style={selected ? { backgroundColor: HIGHLIGHT_COLOR } : {}}
      ref={selected ? (el) => {
        if (el == null) return;
        scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' });
      } : null}
    >
      {children}
    </div>
  );
};

export default Comment;
