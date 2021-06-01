/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  makeStyles, createStyles, Paper, Popper,
} from '@material-ui/core';
import isEqual from 'lodash.isequal';
import {
  getEditorUIStateAndViewIds, getEditorView, getInlineActionAnchorEl,
  getInlineActionKind, getInlineActionPlacement, isInlineActionOpen,
} from '../../store/selectors';
import { State } from '../../store/types';
import { SelectionKinds } from '../../store/ui/types';
import { isEditable } from '../../prosemirror/plugins/editable';

const useStyles = makeStyles(() => createStyles({
  paper: {
    marginTop: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  div: {
    opacity: 0.7,
    transition: 'opacity ease 0.3s',
    '&:hover': {
      opacity: 1,
    },
  },
}));


const alwaysShow = new Set([SelectionKinds.cite]);

const InlineActions: React.FC = (props) => {
  const { children } = props;
  const classes = useStyles();
  const { viewId } = useSelector(
    (state: State) => getEditorUIStateAndViewIds(state), isEqual,
  );
  const kind = useSelector((state: State) => getInlineActionKind(state));
  const anchorEl = useSelector((state: State) => getInlineActionAnchorEl(state));
  const placement = useSelector((state: State) => getInlineActionPlacement(state));
  const open = useSelector((state: State) => isInlineActionOpen(state));
  const view = useSelector((state: State) => getEditorView(state, viewId).view);
  const edit = isEditable(view?.state);
  const showRegardless = (kind && alwaysShow.has(kind));

  if (!open || !(edit || showRegardless) || !view || !anchorEl?.isConnected) return null;

  // This should only render on ui.selection change (on timeout),
  // the internals (if showing) render on state.selection changes (cursor, etc)

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      transition
      placement={placement}
      className="noprint above-modals"
    >
      <Paper className={classes.paper} elevation={10}>
        <div className={classes.div}>
          {children}
        </div>
      </Paper>
    </Popper>
  );
};

export default InlineActions;
