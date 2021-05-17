import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { useSelector } from 'react-redux';
import Citation from '../Citation';
import { State } from '../../store';
import { getEditorState } from '../../store/selectors';
import { ActionProps } from './utils';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 500,
    padding: 15,
  },
}));

const CitationPreview = (props: ActionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { stateId, viewId } = props;
  const classes = useStyles();
  const selection = useSelector(
    (state: State) => getEditorState(state, stateId)?.state?.selection,
  );
  if (!selection || !isNodeSelection(selection)) return null;
  const { node } = selection as NodeSelection;
  if (!isNodeSelection(selection)) return null;
  return (
    <div className={classes.root}>
      <Citation uid={node.attrs.key} />
    </div>
  );
};

export default CitationPreview;
