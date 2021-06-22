import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { Node } from 'prosemirror-model';
import { schemas } from '@curvenote/schema';
import { findParentNode } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { updateNodeAttrs } from '../../store/actions';
import TextAction from './TextAction';
import { getEditorState } from '../../store/selectors';
import { Dispatch, State } from '../../store';
import { ActionProps, positionPopper } from './utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'fit-content',
      fontSize: 20,
      flexWrap: 'nowrap',
    },
  }),
);

const EquationActions: React.FC<ActionProps> = (props) => {
  const { stateId, viewId } = props;
  const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();
  const [labelOpen, setLabelOpen] = useState(false);
  const state = useSelector((s: State) => getEditorState(s, stateId)?.state);
  const parent =
    state?.selection &&
    findParentNode((n: Node) => n.type.name === schemas.nodeNames.heading)(state?.selection);
  const node = parent?.node ?? (state?.selection as NodeSelection).node;
  const pos = parent?.pos ?? state?.selection?.from;
  useEffect(() => setLabelOpen(false), [node]);

  if (!node || pos == null) return null;
  // If the node changes, set open label to false
  const { numbered, label } = node.attrs;

  const onNumbered = () =>
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { numbered: !numbered }, false));
  const onLabel = (t: string) =>
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { label: t }, false));

  const validateId = async (t: string) => {
    if (t === '') return true;
    const r = /^([a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9])$/;
    return r.test(t);
  };

  // Reposition the popper
  positionPopper();

  if (labelOpen) {
    return (
      <TextAction
        text={label}
        onCancel={() => setLabelOpen(false)}
        onSubmit={(t) => {
          onLabel(t);
          setLabelOpen(false);
        }}
        validate={validateId}
        help="The ID must be at least two characters and start with a letter, it may have dashes inside."
      />
    );
  }

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <MenuIcon kind="label" active={Boolean(label)} onClick={() => setLabelOpen(true)} />
      <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />
    </Grid>
  );
};

export default EquationActions;
