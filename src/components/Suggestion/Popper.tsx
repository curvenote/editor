import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorView } from 'prosemirror-view';
import { makeStyles, createStyles, Paper, Popper, PopperProps } from '@material-ui/core';
import { State } from '../../store/types';
import { selectors } from '../../store';
import useClickOutside from '../hooks/useClickOutside';

import { SUGGESTION_ID } from '../../prosemirror/plugins/suggestion';
import { registerPopper } from '../InlineActions';
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

const cache = {
  viewDom: null as Element | null,
};

function getNode(view?: EditorView | null) {
  cache.viewDom = view?.dom ?? cache.viewDom;
  if (!cache.viewDom) return null;
  return cache.viewDom.querySelector(`.${SUGGESTION_ID}`);
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
  const paperRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  useClickOutside(paperRef, () => {
    dispatch(closeSuggestion());
  });
  const { view } = useSelector(getSelectedView);
  if (!open || !getNode(view)) return null;
  return (
    <Popper
      className="above-modals"
      open={open}
      anchorEl={anchorEl}
      popperRef={(pop) => registerPopper(pop)}
      placement="bottom-start"
    >
      <Paper className={classes.root} elevation={10} ref={paperRef}>
        {children}
      </Paper>
    </Popper>
  );
};

export default Suggestion;
