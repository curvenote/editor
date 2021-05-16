/* eslint-disable max-len */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  makeStyles, createStyles, Paper, Popper,
} from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { getEditorUI, getEditorView } from '../../store/selectors';
import { State } from '../../store/types';
import LinkActions from './LinkActions';
import AlignActions from './AlignActions';
import { SelectionKinds } from '../../store/ui/types';
import CitationPreview from './CitationPreview';
import CalloutActions from './CalloutActions';
import TimeActions from './TimeActions';
import HeadingActions from './HeadingActions';
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

const Toolbar = () => {
  const classes = useStyles();
  const stateId = useSelector((state: State) => getEditorUI(state).stateId);
  const viewId = useSelector((state: State) => getEditorUI(state).viewId);
  const selection = useSelector((state: State) => getEditorUI(state).selection, isEqual);
  const view = useSelector((state: State) => getEditorView(state, viewId).view);
  const edit = isEditable(view?.state);
  const open = selection != null;
  const { kind, anchorEl, placement } = selection ?? {};
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
      className="noprint"
    >
      <Paper
        className={classes.paper}
        elevation={10}
      >
        <div className={classes.div}>
          {/* TODO: Link action refactor */}
          {kind === SelectionKinds.link && <LinkActions {...{ stateId, viewId, anchorEl }} />}
          {kind === SelectionKinds.image && <AlignActions showCaption {...{ stateId, viewId, anchorEl }} />}
          {kind === SelectionKinds.iframe && <AlignActions {...{ stateId, viewId, anchorEl }} />}
          {kind === SelectionKinds.callout && <CalloutActions {...{ stateId, viewId, anchorEl }} />}
          {kind === SelectionKinds.heading && <HeadingActions {...{ stateId, viewId, anchorEl }} />}
          {/* {kind === SelectionKinds.math && <AlignActions view={view} />} */}
          {/* {kind === SelectionKinds.equation && <AlignActions view={view} />} */}
          {kind === SelectionKinds.cite && <CitationPreview {...{ stateId, viewId, anchorEl }} />}
          {kind === SelectionKinds.time && <TimeActions {...{ stateId, viewId, anchorEl }} />}
        </div>
      </Paper>
    </Popper>
  );
};

export default Toolbar;
