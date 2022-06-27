import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles, createStyles, Grid, Button, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { NodeSelection } from 'prosemirror-state';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, deleteNode, switchLinkType } from '../../store/actions';
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
  }),
);

export function useLinkBlockActions(stateId: any, viewId: string | null) {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector((s: State) => getEditorState(s, stateId)?.state);
  const selection = useMemo(() => {
    try {
      return state?.doc ? NodeSelection.create(state.doc, state.selection.from) : null;
    } catch (e) {
      return undefined;
    }
  }, [state]);
  const node = selection?.node;
  const attrs = node?.attrs;
  const from = selection?.from;
  const url = selection?.node?.attrs?.url || '';

  const onOpen = useCallback(() => {
    if (!url) return;
    window.open(url, '_blank');
  }, [url]);

  const onDelete = useCallback(() => {
    if (typeof from === 'undefined' || !node) return;
    dispatch(deleteNode(stateId, viewId, { node, pos: from }));
  }, [stateId, viewId, node, from, dispatch]);

  const onEdit = useCallback(
    (newHref: string) => {
      if (!state || !node || typeof from === 'undefined' || !newHref) return;
      if (newHref === node.attrs.url) return;
      const newNode = state.schema.nodes.link_block.createAndFill({
        ...node.attrs,
        url: newHref,
      }) as any;
      const tr = state.tr.replaceRangeWith(from, from + node.nodeSize, newNode);
      dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
    },
    [stateId, viewId, node, from, state, dispatch],
  );

  const tooltip = attrs?.title ? `${attrs.title} <${attrs?.url}>` : attrs?.url;
  //
  return {
    attrs: node?.attrs ?? null,
    tooltip: tooltip ?? '',
    onOpen,
    onDelete,
    onEdit,
    node,
  };
}

function isValidUrl(str: string) {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return !!url;
}

function LinkBlockActions(props: ActionProps) {
  const { stateId, viewId } = props;
  const [labelOpen, setLabelOpen] = useState(false);
  const dispatch = useDispatch<Dispatch>();
  const classes = useStyles();
  const link = useLinkBlockActions(stateId, viewId);
  const { attrs, onEdit, onOpen, onDelete, node } = link;

  useEffect(() => {
    setLabelOpen(false);
  }, [node]);

  if (labelOpen) {
    const text = attrs?.url ?? '';
    return (
      <TextAction
        text={text}
        onCancel={() => setLabelOpen(false)}
        onSubmit={(t) => {
          onEdit(t);
          setLabelOpen(false);
        }}
        validate={isValidUrl}
        help="Please provide a valid URL"
      />
    );
  }

  if (!stateId || !viewId) return null;

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.grid}>
      <div style={{ marginLeft: 10 }}>
        <LinkTypeSelect
          value="link-block"
          onChange={(value) => {
            if (value === 'link') {
              dispatch(switchLinkType({ linkType: 'link', stateId, viewId, url: node?.attrs.url }));
            }
          }}
        />
      </div>
      <MenuIcon kind="divider" />
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
      <MenuIcon kind="remove" onClick={onDelete ?? undefined} dangerous />
    </Grid>
  );
}

export default LinkBlockActions;
