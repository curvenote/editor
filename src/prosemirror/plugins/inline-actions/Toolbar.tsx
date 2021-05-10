import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper } from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import { getEditorUI } from '../../../store/selectors';
import { State } from '../../../store/types';
import LinkActions from './LinkActions';
import AlignActions from './AlignActions';
import { SelectionKinds } from './types';
import CitationPreview from './CitationPreview';
import CalloutActions from './CalloutActions';
import TimeActions from './TimeActions';

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


type Props = {
  view: EditorView;
  open: boolean;
  edit: boolean;
  kind: SelectionKinds | null;
};

const alwaysShow = new Set([SelectionKinds.cite]);

const Toolbar = (props: Props) => {
  const {
    view, open, edit, kind,
  } = props;

  const classes = useStyles();
  const selectedId = useSelector((state: State) => getEditorUI(state).viewId);
  const selected = selectedId === view.dom.id;

  const showRegardless = (kind && alwaysShow.has(kind));

  if (!open || !(edit || showRegardless) || !selected) return null;

  return (
    <Paper
      className={classes.paper}
      elevation={10}
    >
      <div className={classes.div}>
        {kind === SelectionKinds.link && <LinkActions view={view} />}
        {kind === SelectionKinds.image && <AlignActions showCaption view={view} />}
        {kind === SelectionKinds.iframe && <AlignActions view={view} />}
        {kind === SelectionKinds.callout && <CalloutActions view={view} />}
        {/* {kind === SelectionKinds.math && <AlignActions view={view} />} */}
        {/* {kind === SelectionKinds.equation && <AlignActions view={view} />} */}
        {kind === SelectionKinds.cite && <CitationPreview view={view} />}
        {kind === SelectionKinds.time && <TimeActions view={view} />}
      </div>
    </Paper>
  );
};

export default Toolbar;
