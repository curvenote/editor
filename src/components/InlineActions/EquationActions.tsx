import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { Node } from 'prosemirror-model';
import { nodeNames } from '@curvenote/schema';
import { findParentNode } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { updateNodeAttrs } from '../../store/actions';
import { getEditorState } from '../../store/selectors';
import { Dispatch, State } from '../../store';
import { ActionProps, positionPopper } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';

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
  const state = useSelector((s: State) => getEditorState(s, stateId)?.state);
  const parent =
    state?.selection &&
    findParentNode((n: Node) => n.type.name === nodeNames.heading)(state?.selection);
  const node = parent?.node ?? getNodeFromSelection(state?.selection);
  const pos = parent?.pos ?? state?.selection?.from;

  if (!node || pos == null) return null;
  // If the node changes, set open label to false
  const { numbered } = node.attrs;

  const onNumbered = () =>
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { numbered: !numbered }, false));

  // Reposition the popper
  positionPopper();

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />
    </Grid>
  );
};

export default EquationActions;
