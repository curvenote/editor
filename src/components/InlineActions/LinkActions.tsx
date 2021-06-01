import React, { useCallback, useState } from 'react';
import {
  makeStyles,
  createStyles, Grid, Button, Tooltip,
} from '@material-ui/core';
import { types } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import {
  applyProsemirrorTransaction, getLinkBoundsIfTheyExist, removeMark, testLink, testLinkWeak,
} from '../../store/actions';
import { ActionProps } from './utils';
import { getEditorState } from '../../store/state/selectors';
import { Dispatch, State } from '../../store';
import TextAction from './TextAction';

const useStyles = makeStyles(() => createStyles({
  grid: {
    width: 'fit-content',
    fontSize: 20,
  },
  button: {
    marginLeft: 5,
  },
}));

export function useLinkActions(stateId: any, viewId: string | null) {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector((s: State) => getEditorState(s, stateId)?.state);
  const linkBounds = getLinkBoundsIfTheyExist(state);
  const attrs = linkBounds?.mark.attrs as types.LinkAttrs | null ?? null;
  const onOpen = useCallback(() => window.open(attrs?.href, '_blank'), [attrs?.href]);
  const mark = state?.schema.marks.link;
  const onDelete = useCallback(() => {
    if (!linkBounds || !mark) return;
    dispatch(removeMark(stateId, viewId, mark, linkBounds.from, linkBounds.to));
  }, [stateId, viewId, linkBounds, mark]);
  const onEdit = useCallback((newHref: string) => {
    if (!newHref || !linkBounds || !state || !mark) return;
    const link = mark.create({ href: testLink(newHref) ? newHref : `http://${newHref}` });
    const tr = state.tr
      .removeMark(linkBounds.from, linkBounds.to, mark)
      .addMark(linkBounds.from, linkBounds.to, link);
    dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
  }, [stateId, viewId, linkBounds, mark]);

  const tooltip = attrs?.title ? `${attrs.title} <${attrs?.href}>` : attrs?.href;

  return {
    attrs: attrs ?? null,
    tooltip: tooltip ?? '',
    bounds: linkBounds,
    onOpen,
    onDelete,
    onEdit,
  };
}


const LinkActions = (props: ActionProps) => {
  const { stateId, viewId } = props;
  const [labelOpen, setLabelOpen] = useState(false);
  const classes = useStyles();
  const link = useLinkActions(stateId, viewId);
  if (!link) return null;
  const {
    attrs, onEdit, onOpen, onDelete,
  } = link;

  if (labelOpen) {
    return (
      <TextAction
        text={attrs?.href ?? ''}
        onCancel={() => setLabelOpen(false)}
        onSubmit={(t) => { onEdit(t); setLabelOpen(false); }}
        validate={testLinkWeak}
        help="Please provide a valid URL"
      />
    );
  }

  return (
    <Grid container alignItems="center" justify="center" className={classes.grid}>
      <Tooltip title={link.tooltip}>
        <Button
          className={classes.button}
          onClick={() => setLabelOpen(true)}
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
