import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import { nodeNames } from '@curvenote/schema';
import { Fragment, Node, NodeType } from 'prosemirror-model';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, deleteNode, updateNodeAttrs } from '../../store/actions';
import SelectWidth from './SelectWidth';
import { ActionProps, positionPopper } from './utils';
import { Dispatch, State } from '../../store';
import { getEditorView } from '../../store/selectors';
import { getNodeFromSelection } from '../../store/ui/utils';
import { createFigureCaption } from './FigureActions';

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

const ImageActions: React.FC<Props> = (props) => {
  const { stateId, viewId } = props;
  const dispatch = useDispatch<Dispatch>();
  const classes = useStyles();
  const view = useSelector((state: State) => getEditorView(state, viewId)?.view);
  const selection = view?.state?.selection;
  const node = getNodeFromSelection(selection);
  if (!view || !node || !selection || !isNodeSelection(selection)) return null;
  const { from: pos } = selection;
  const { src, width } = node?.attrs;

  const onWidth = (value: number) => {
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { width: value }));
  };
  const onCaption = () => {
    const Figure = view.state.schema.nodes[nodeNames.figure] as NodeType;
    const caption = createFigureCaption(view.state.schema, src);
    const figure = Figure.createAndFill({}, Fragment.fromArray([node, caption])) as Node;
    const tr = view.state.tr.replaceSelectionWith(figure);
    dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
  };
  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));

  positionPopper();

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <SelectWidth width={width} onWidth={onWidth} />
      <MenuIcon kind="caption" onClick={onCaption} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default ImageActions;
