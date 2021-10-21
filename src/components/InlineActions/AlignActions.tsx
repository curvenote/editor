import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import { types } from '@curvenote/schema';
import MenuIcon from '../Menu/Icon';
import { deleteNode, updateNodeAttrs } from '../../store/actions';
import SelectWidth from './SelectWidth';
import { ActionProps, positionPopper } from './utils';
import { Dispatch, State } from '../../store';
import { getEditorState } from '../../store/selectors';
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

type Props = ActionProps;

const AlignActions: React.FC<Props> = (props) => {
  const { stateId, viewId } = props;
  const dispatch = useDispatch<Dispatch>();
  const classes = useStyles();
  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  const node = getNodeFromSelection(selection);
  if (!node || !selection || !isNodeSelection(selection)) return null;
  const { from: pos } = selection;
  const { align, width } = node?.attrs;

  const onAlign = (a: types.AlignOptions) => () => {
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { align: a }));
  };
  const onWidth = (value: number) => {
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { width: value }));
  };
  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));

  positionPopper();

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <MenuIcon kind="left" active={align === 'left'} onClick={onAlign('left')} />
      <MenuIcon kind="center" active={align === 'center'} onClick={onAlign('center')} />
      <MenuIcon kind="right" active={align === 'right'} onClick={onAlign('right')} />
      <MenuIcon kind="divider" />
      <SelectWidth width={width} onWidth={onWidth} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default AlignActions;
