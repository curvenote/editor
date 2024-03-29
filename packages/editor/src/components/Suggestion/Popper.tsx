import React, { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';

import { selectors } from '../../store';
import useClickOutside from '../hooks/useClickOutside';
import { usePopper } from '../InlineActions';
import { closeSuggestion } from '../../store/actions';
import { getSelectedView } from '../../store/selectors';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minWidth: 300,
      maxWidth: 500,
      maxHeight: 350,
      overflowY: 'auto',
      margin: '10px 0',
    },
  }),
);

type Props = {
  children: React.ReactNode;
};

function Suggestion(props: Props) {
  const { children } = props;
  const open = useSelector(selectors.isSuggestionOpen);
  const classes = useStyles();
  const paperRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  useClickOutside(paperRef, () => {
    dispatch(closeSuggestion());
  });
  const { view } = useSelector(getSelectedView);
  const autocomplete = view?.dom.querySelector('.autocomplete');
  const [popperRef] = usePopper(autocomplete);

  if (!open || !autocomplete?.isConnected) return null;
  return (
    <Popper
      className="above-modals"
      open={open}
      anchorEl={autocomplete}
      popperRef={popperRef}
      placement="bottom-start"
    >
      <Paper className={classes.root} elevation={10} ref={paperRef}>
        {children}
      </Paper>
    </Popper>
  );
}

export default Suggestion;
