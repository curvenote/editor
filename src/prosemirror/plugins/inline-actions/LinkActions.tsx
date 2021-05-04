import React, { useCallback } from 'react';
import {
  makeStyles,
  createStyles, Grid, Button, Tooltip,
} from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import MenuIcon from '../../../components/Menu/Icon';
import { getLinkBoundsIfTheyExist } from '../../../store/actions';

const useStyles = makeStyles(() => createStyles({
  grid: {
    width: 'fit-content',
    fontSize: 20,
  },
  button: {
    marginLeft: 5,
  },
}));


type Props = {
  view: EditorView;
};

const LinkActions = (props: Props) => {
  const { view } = props;
  const { state } = view;
  const linkBounds = getLinkBoundsIfTheyExist(state);
  if (!linkBounds) return null;
  const { href } = linkBounds.mark.attrs;
  const mark = state.schema.marks.link;
  const onDelete = () => (
    view.dispatch(state.tr.removeMark(linkBounds.from, linkBounds.to, mark))
  );
  const onEdit = () => {
    // eslint-disable-next-line no-alert
    const newHref = prompt('What is the new link?', href);
    if (!newHref) return;
    const link = mark.create({ href: newHref });
    const tr = state.tr
      .removeMark(linkBounds.from, linkBounds.to, mark)
      .addMark(linkBounds.from, linkBounds.to, link);
    view.dispatch(tr);
  };

  const classes = useStyles();
  const onOpen = useCallback(() => window.open(href, '_blank'), [href]);

  return (
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
  );
};

export default LinkActions;
