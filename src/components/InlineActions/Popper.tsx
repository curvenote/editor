import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import {
  getEditorUIStateAndViewIds,
  getEditorView,
  getInlineActionAnchorEl,
  getInlineActionKind,
  getInlineActionPlacement,
  isInlineActionOpen,
} from '../../store/selectors';
import { State } from '../../store/types';
import { SelectionKinds } from '../../store/ui/types';
import { isEditable } from '../../prosemirror/plugins/editable';
import { createPopperLocationCache, registerPopper } from './utils';

const useStyles = makeStyles(() =>
  createStyles({
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
  }),
);

const alwaysShow = new Set([SelectionKinds.cite]);
const cache = createPopperLocationCache();

const InlineActions: React.FC = (props) => {
  const { children } = props;
  const classes = useStyles();
  const { viewId } = useSelector(getEditorUIStateAndViewIds, isEqual);
  const kind = useSelector(getInlineActionKind);
  const currentEl = useSelector(getInlineActionAnchorEl);
  const placement = useSelector(getInlineActionPlacement);
  const open = useSelector(isInlineActionOpen);
  const view = useSelector((state: State) => getEditorView(state, viewId).view);
  const edit = isEditable(view?.state);
  const showRegardless = kind && alwaysShow.has(kind);

  cache.setNode(currentEl);

  if (!open || !(edit || showRegardless) || !view || !cache.getNode()?.isConnected) return null;

  // This should only render on ui.selection change (on timeout),
  // the internals (if showing) render on state.selection changes (cursor, etc)

  return (
    <Popper
      open={open}
      anchorEl={cache.anchorEl}
      transition
      placement={placement}
      popperRef={(pop) => registerPopper(pop)}
      className="noprint above-modals"
    >
      <Paper className={classes.paper} elevation={10}>
        <div className={classes.div}>{children}</div>
      </Paper>
    </Popper>
  );
};

export default InlineActions;
