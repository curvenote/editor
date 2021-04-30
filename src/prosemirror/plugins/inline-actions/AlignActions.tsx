import React from 'react';
import {
  makeStyles, createStyles, Grid, Popover, Slider,
} from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import MenuIcon from '../../../components/Menu/Icon';
import { AlignOptions } from '../../../types';
import { setNodeViewAlign, setNodeViewDelete, setNodeViewWidth } from '../../../store/actions';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 'fit-content',
    fontSize: 20,
    flexWrap: 'nowrap',
  },
  popover: {
    overflow: 'visible',
  },
}));

type Props = {
  view: EditorView;
};

const AlignActions = (props: Props) => {
  const { view } = props;

  const { node, from } = view.state.selection as NodeSelection;

  const onAlign = setNodeViewAlign(node, view, () => from);
  const onWidth = setNodeViewWidth(node, view, () => from);
  const onDelete = setNodeViewDelete(node, view, () => from);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  if (!isNodeSelection(view.state.selection)) return null;

  const { align, width } = node.attrs;

  const doAlign = (a: AlignOptions) => () => onAlign(a);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const openWidth = Boolean(anchorEl);

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <MenuIcon kind="left" active={align === 'left'} onClick={doAlign('left')} />
      <MenuIcon kind="center" active={align === 'center'} onClick={doAlign('center')} />
      <MenuIcon kind="right" active={align === 'right'} onClick={doAlign('right')} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="imageWidth" active={openWidth} onClick={handleClick} />
      <Popover
        open={openWidth}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ width: 120, padding: '5px 25px' }}>
          <Slider
            defaultValue={width}
            step={10}
            marks
            min={10}
            max={100}
            onChangeCommitted={(e, v) => { handleClose(); onWidth(v as number); }}
          />
        </div>
      </Popover>
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default AlignActions;
