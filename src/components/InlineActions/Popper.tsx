import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper, PopperProps } from '@material-ui/core';
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
import { registerPopper } from './utils';

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

const cache: {
  node: HTMLElement | Element | null;
  clientRect: ClientRect | null;
  clientWidth: number;
  clientHeight: number;
} = {
  node: null,
  clientRect: null,
  clientWidth: 0,
  clientHeight: 0,
};

function setNode(node: HTMLElement | Element | null) {
  if (node && node.isConnected) {
    cache.node = node;
    cache.clientRect = node.getBoundingClientRect();
    cache.clientWidth = node.clientWidth ?? 0;
    cache.clientHeight = node.clientHeight ?? 0;
  }
}
function getNode() {
  return cache.node;
}

const anchorEl: PopperProps['anchorEl'] = {
  getBoundingClientRect() {
    setNode(cache.node);
    return cache.clientRect as ClientRect;
  },
  get clientWidth() {
    setNode(cache.node);
    return cache.clientWidth;
  },
  get clientHeight() {
    setNode(cache.node);
    return cache.clientHeight;
  },
};

const InlineActions: React.FC = (props) => {
  const { children } = props;
  const classes = useStyles();
  const { viewId } = useSelector((state: State) => getEditorUIStateAndViewIds(state), isEqual);
  const kind = useSelector((state: State) => getInlineActionKind(state));
  const currentEl = useSelector((state: State) => getInlineActionAnchorEl(state));
  const placement = useSelector((state: State) => getInlineActionPlacement(state));
  const open = useSelector((state: State) => isInlineActionOpen(state));
  const view = useSelector((state: State) => getEditorView(state, viewId).view);
  const edit = isEditable(view?.state);
  const showRegardless = kind && alwaysShow.has(kind);

  setNode(currentEl);

  if (!open || !(edit || showRegardless) || !view || !getNode()?.isConnected) return null;

  // This should only render on ui.selection change (on timeout),
  // the internals (if showing) render on state.selection changes (cursor, etc)

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
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
