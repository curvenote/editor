import React, { useCallback } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { findParentNode } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';
import { nodeNames } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { deleteNode } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import { actions, Dispatch, State } from '../../store';
import { ActionProps, positionPopper } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';
import { CommandNames } from '../../store/suggestion/commands';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'fit-content',
      fontSize: 20,
      flexWrap: 'nowrap',
    },
    popover: {
      overflow: 'visible',
    },
  }),
);

const TableActions: React.FC<ActionProps> = (props) => {
  const { stateId, viewId } = props;
  const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();

  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  const parent =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.table)(selection);
  const node = parent?.node ?? getNodeFromSelection(selection);
  const pos = parent?.pos ?? selection?.from;

  const command = useCallback(
    (name: CommandNames) => dispatch(actions.executeCommand(name, viewId)),
    [stateId, viewId],
  );
  if (!node || pos == null) return null;
  positionPopper();

  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <MenuIcon kind="rowAbove" onClick={() => command(CommandNames.add_row_before)} />
      <MenuIcon kind="rowBelow" onClick={() => command(CommandNames.add_row_after)} />
      <MenuIcon kind="colLeft" onClick={() => command(CommandNames.add_column_before)} />
      <MenuIcon kind="colRight" onClick={() => command(CommandNames.add_column_after)} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="rowDelete" onClick={() => command(CommandNames.delete_row)} dangerous />
      <MenuIcon kind="colDelete" onClick={() => command(CommandNames.delete_column)} dangerous />
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default TableActions;
