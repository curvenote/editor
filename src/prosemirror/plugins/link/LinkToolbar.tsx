import React, { useCallback } from 'react';
import {
  makeStyles,
  createStyles, Theme, Paper, Grid, Button, Tooltip,
} from '@material-ui/core';
import MenuIcon from '../../../components/Menu/Icon';

const useStyles = makeStyles((theme: Theme) => createStyles({
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
  open: boolean;
  edit: boolean;
  href: string;
  onDelete: null | (() => void);
  onEdit: null | (() => void);
};

const LinkToolbar = (props: Props) => {
  const {
    open, edit, href,
    onEdit, onDelete,
  } = props;

  const classes = useStyles();
  const onOpen = useCallback(() => window.open(href, '_blank'), [href]);

  if (!open || !edit) return null;

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
