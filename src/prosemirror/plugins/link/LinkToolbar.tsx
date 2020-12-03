import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  makeStyles,
  createStyles, Paper, Grid, Button, Tooltip,
} from '@material-ui/core';
import MenuIcon from '../../../components/Menu/Icon';
import { getEditorUI } from '../../../store/selectors';
import { State } from '../../../store/types';

const useStyles = makeStyles(() => createStyles({
  paper: {
    overflow: 'hidden',
    height: 38,
    zIndex: 1,
  },
  grid: {
    width: 'fit-content',
    fontSize: 20,
  },
  button: {
    marginLeft: 5,
  },
}));


type Props = {
  viewId: string;
  open: boolean;
  edit: boolean;
  href: string;
  onDelete: null | (() => void);
  onEdit: null | (() => void);
};

const LinkToolbar = (props: Props) => {
  const {
    viewId,
    open, edit, href,
    onEdit, onDelete,
  } = props;

  const classes = useStyles();
  const selectedId = useSelector((state: State) => getEditorUI(state).viewId);
  const selected = selectedId === viewId;
  const onOpen = useCallback(() => window.open(href, '_blank'), [href]);

  if (!open || !edit || !selected) return null;

  return (
    <Paper
      className={classes.paper}
      elevation={10}
    >
      <Grid container alignItems="center" justify="center" className={classes.grid}>
        <Tooltip title={href}>
          <Button
            className={classes.button}
            onClick={onEdit ?? undefined}
            size="small"
            disableElevation
          >
            Edit Link
          </Button>
        </Tooltip>
        <MenuIcon kind="divider" />
        <MenuIcon kind="open" onClick={onOpen} />
        <MenuIcon kind="divider" />
        <MenuIcon kind="unlink" onClick={onDelete ?? undefined} dangerous />
      </Grid>
    </Paper>
  );
};

export default LinkToolbar;
