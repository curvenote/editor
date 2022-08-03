import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { isNodeSelection } from '@curvenote/prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import {
  applyProsemirrorTransaction,
  deleteNode,
  updateNodeAttrs,
  createFigure,
} from '../../store/actions';
import SelectWidth from './SelectWidth';
import { ActionProps } from './utils';
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

function ImageActions(props: Props) {
  const { stateId, viewId } = props;
  const dispatch = useDispatch<Dispatch>();
  const classes = useStyles();
  const editorState = useSelector((state: State) => getEditorState(state, stateId)?.state);
  const selection = editorState?.selection;
  const node = getNodeFromSelection(selection);
  if (!editorState || !node || !selection || !isNodeSelection(selection)) return null;
  const { from: pos } = selection;
  const { width } = node.attrs;

  const onWidth = (value: number) => {
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { width: value }));
  };
  const onCaption = () => {
    const figure = createFigure(editorState.schema, node, true);
    const tr = editorState.tr.replaceSelectionWith(figure);
    dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
  };
  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <SelectWidth width={width} onWidth={onWidth} />
      <MenuIcon kind="caption" onClick={onCaption} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
}

export default ImageActions;
