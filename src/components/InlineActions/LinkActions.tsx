import React, { useCallback, useState } from 'react';
import { makeStyles, createStyles, Grid, Button, Tooltip, Box } from '@material-ui/core';
import { types } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import {
  applyProsemirrorTransaction,
  getLinkBoundsIfTheyExist,
  normalizeUrl,
  removeMark,
  switchLinkType,
  validateUrl,
} from '../../store/actions';
import { ActionProps } from './utils';
import { getEditorState } from '../../store/state/selectors';
import { Dispatch, State } from '../../store';
import TextAction from './TextAction';
import { LinkTypeSelect } from './LinkTypeSelect';

const useStyles = makeStyles(() =>
  createStyles({
    grid: {
      width: 'fit-content',
      fontSize: 20,
    },
    button: {
      marginLeft: 5,
    },
    menulist: {
      maxHeight: '15rem',
    },
  }),
);

export function useLinkActions(stateId: any, viewId: string | null) {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector((s: State) => getEditorState(s, stateId)?.state);
  const linkBounds = getLinkBoundsIfTheyExist(state);
  const attrs = (linkBounds?.mark.attrs as types.LinkAttrs | null) ?? null;
  const mark = state?.schema.marks.link;

  const onOpen = useCallback(() => window.open(attrs?.href, '_blank'), [attrs?.href]);

  const onDelete = useCallback(() => {
    if (!linkBounds || !mark) return;
    dispatch(removeMark(stateId, viewId, mark, linkBounds.from, linkBounds.to));
  }, [stateId, viewId, linkBounds, mark, dispatch]);

  const onEdit = useCallback(
    (newHref: string) => {
      if (!newHref || !linkBounds || !state || !mark) return;
      const link = mark.create({ href: normalizeUrl(newHref) });
      const tr = state.tr
        .removeMark(linkBounds.from, linkBounds.to, mark)
        .addMark(linkBounds.from, linkBounds.to, link);
      dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
    },
    [stateId, viewId, linkBounds, mark, dispatch, state],
  );

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

function LinkActions(props: ActionProps) {
  const { stateId, viewId } = props;
  const [labelOpen, setLabelOpen] = useState(false);
  const classes = useStyles();
  const link = useLinkActions(stateId, viewId);
  const dispatch = useDispatch();
  if (!link) return null;
  const { attrs, onEdit, onOpen, onDelete } = link;

  if (labelOpen) {
    return (
      <TextAction
        text={attrs?.href ?? ''}
        enableSubmitIfInvalid
        onCancel={() => setLabelOpen(false)}
        onSubmit={(t) => {
          onEdit(t);
          setLabelOpen(false);
        }}
        validate={validateUrl}
        help="URL may be invalid"
      />
    );
  }

  if (!viewId || !stateId || !attrs) return null;

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.grid}>
      <Box ml={2}>
        <LinkTypeSelect
          value="link"
          onChange={(value) => {
            if (value === 'link-block') {
              dispatch(
                switchLinkType({ linkType: 'link-block', stateId, viewId, url: attrs.href }),
              );
            }
          }}
        />
      </Box>
      <MenuIcon kind="divider" />
      <Tooltip title={link.tooltip}>
        <Button
          aria-label="edit link inline"
          className={classes.button}
          onClick={() => {
            setLabelOpen(true);
          }}
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
}

export default LinkActions;
