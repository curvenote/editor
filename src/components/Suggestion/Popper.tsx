import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper, PopperProps } from '@material-ui/core';
import { State } from '../../store/types';
import { selectors } from '../../store';
import { SUGGESTION_ID } from '../../prosemirror/plugins/suggestion';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minWidth: 300,
      maxWidth: 500,
      maxHeight: 350,
      overflowY: 'scroll',
      margin: '10px 0',
    },
  }),
);

function getNode() {
  return document.getElementById(SUGGESTION_ID);
}

const anchorEl: PopperProps['anchorEl'] = {
  getBoundingClientRect() {
    return getNode()?.getBoundingClientRect() as ClientRect;
  },
  get clientWidth() {
    return getNode()?.clientWidth ?? 0;
  },
  get clientHeight() {
    return getNode()?.clientHeight ?? 0;
  },
};

const Suggestion: React.FC = (props) => {
  const { children } = props;
  const open = useSelector((state: State) => selectors.isSuggestionOpen(state));
  const classes = useStyles();
  if (!open || !getNode()) return null;
  // popperRef={(pop) => console.log(pop)}
  return (
    <Popper className="above-modals" open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper className={classes.root} elevation={10}>
        {children}
      </Paper>
    </Popper>
  );
};

export default Suggestion;
