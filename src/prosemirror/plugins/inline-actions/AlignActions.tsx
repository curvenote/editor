import React from 'react';
import {
  makeStyles, createStyles, Grid,
} from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import MenuIcon from '../../../components/Menu/Icon';
import { AlignOptions } from '../../../types';
import { setNodeViewAlign, setNodeViewDelete, setNodeViewWidth } from '../../../store/actions';
import SelectWidth from './SelectWidth';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 'fit-content',
    fontSize: 20,
    flexWrap: 'nowrap',
  },
}));

type Props = {
  view: EditorView;
};

const AlignActions = (props: Props) => {
  const { view } = props;
  const classes = useStyles();

  const { node, from } = view.state.selection as NodeSelection;

  const onAlign = setNodeViewAlign(node, view, from);
  const doAlign = (a: AlignOptions) => () => onAlign(a);
  const onWidth = setNodeViewWidth(node, view, from);
  const onDelete = setNodeViewDelete(node, view, from);

  if (!isNodeSelection(view.state.selection)) return null;

  const { align, width } = node.attrs;
  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <MenuIcon kind="left" active={align === 'left'} onClick={doAlign('left')} />
      <MenuIcon kind="center" active={align === 'center'} onClick={doAlign('center')} />
      <MenuIcon kind="right" active={align === 'right'} onClick={doAlign('right')} />
      <MenuIcon kind="divider" />
      <SelectWidth width={width} onWidth={onWidth} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default AlignActions;
