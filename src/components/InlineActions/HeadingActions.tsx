import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { Node } from 'prosemirror-model';
import { schemas } from '@curvenote/schema';
import { findParentNode } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { deleteNode, updateNodeAttrs } from '../../store/actions';
import TextAction from './TextAction';
import { getEditorState } from '../../store/selectors';
import { Dispatch, State } from '../../store';
import { ActionProps, positionPopper, newLabel } from './utils';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 'fit-content',
    fontSize: 20,
    flexWrap: 'nowrap',
  },
}));

const HeadingActions = (props: ActionProps) => {
  const { stateId, viewId, anchorEl } = props;
  const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();
  const [labelOpen, setLabelOpen] = useState(false);
  const selection = useSelector(
    (state: State) => getEditorState(state, stateId)?.state?.selection,
  );
  const parent = selection && findParentNode(
    (n: Node) => n.type.name === schemas.nodeNames.heading,
  )(selection);
  const node = parent?.node ?? (selection as NodeSelection).node;
  const pos = parent?.pos ?? selection?.from;
  useEffect(() => setLabelOpen(false), [node]);
  if (!node || pos == null) return null;
  // If the node changes, set open label to false
  const { numbered, label } = node.attrs;
  positionPopper(anchorEl);

  const onNumbered = () => dispatch(updateNodeAttrs(
    stateId, viewId, { node, pos }, (label === '' ? { numbered: !numbered, label: newLabel('sec') } : { numbered: !numbered }),
  ));
  const onLabel = (t: string) => dispatch(updateNodeAttrs(
    stateId, viewId, { node, pos }, (t === '' ? { label: newLabel('sec') } : { label: t }),
  ));
  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));

  const validateId = async (t: string) => {
    if (t === '') return true;
    const r = /^([a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9])$/;
    return r.test(t);
  };

  // Reposition the popper
  window.scrollBy(0, 1); window.scrollBy(0, -1);

  if (labelOpen) {
    return (
      <TextAction
        text={label}
        onCancel={() => setLabelOpen(false)}
        onSubmit={(t) => { onLabel(t); setLabelOpen(false); }}
        validate={validateId}
        help="The ID must be at least two characters and start with a letter, it may have dashes inside."
      />
    );
  }

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <MenuIcon kind="label" active onClick={() => setLabelOpen(true)} />
      <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default HeadingActions;
