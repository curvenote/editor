/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';
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

const Suggestion: React.FC = (props) => {
  const { children } = props;
  const open = useSelector((state: State) => selectors.isSuggestionOpen(state));
  const classes = useStyles();
  const anchorEl = document.getElementById(SUGGESTION_ID);
  if (!open || !anchorEl) return null;
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
