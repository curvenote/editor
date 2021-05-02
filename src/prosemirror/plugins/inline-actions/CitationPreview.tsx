import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import Citation from '../../../components/Citation';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 500,
    padding: 15,
  },
}));

type Props = {
  view: EditorView;
};

const CitationPreview = (props: Props) => {
  const { view } = props;
  const { node } = view.state.selection as NodeSelection;
  const classes = useStyles();
  if (!isNodeSelection(view.state.selection)) return null;
  return (
    <div className={classes.root}>
      <Citation uid={node.attrs.key} />
    </div>
  );
};

export default CitationPreview;
