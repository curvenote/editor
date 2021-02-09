import React from 'react';
import { useSelector } from 'react-redux';
import {
  makeStyles, createStyles, Paper,
} from '@material-ui/core';
import { getEditorUI } from '../../../store/selectors';
import { State } from '../../../store/types';
import Citation from '../../../components/Citation';

const useStyles = makeStyles(() => createStyles({
  paper: {
    width: 500,
    padding: 15,
  },
}));


type Props = {
  viewId: string;
  uid: string;
  open: boolean;
  edit: boolean;
};

const PreviewPopup = (props: Props) => {
  const {
    viewId,
    open, edit, uid,
  } = props;

  const classes = useStyles();
  const selectedId = useSelector((state: State) => getEditorUI(state).viewId);
  const selected = selectedId === viewId;

  if (!open || !selected) return null;

  return (
    <Paper
      className={classes.paper}
      elevation={10}
    >
      <Citation uid={uid} />
    </Paper>
  );
};

export default PreviewPopup;
