import React from 'react';
import { useSelector } from 'react-redux';
import {
  makeStyles,
  createStyles, Paper, Grid, Popover, Slider,
} from '@material-ui/core';
import MenuIcon from '../../../components/Menu/Icon';
import { getEditorUI } from '../../../store/ui/selectors';
import { State } from '../../../store/types';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 'fit-content',
    fontSize: 20,
  },
  paper: {
    width: 215,
    overflow: 'hidden',
    height: 38,
    zIndex: 1,
  },
  popover: {
    overflow: 'visible',
  },
}));

export type AlignOptions = 'left' | 'center' | 'right';

type Props = {
  viewId: string;
  open: boolean;
  align: AlignOptions;
  width: number;
  onAlign: (align: AlignOptions) => void;
  onWidth: (width: number) => void;
  onDelete: () => void;
};

const ImageToolbar = (props: Props) => {
  const {
    viewId,
    open, width, align, onAlign, onWidth, onDelete,
  } = props;

  const classes = useStyles();
  const selectedId = useSelector((state: State) => getEditorUI(state).viewId);
  const selected = selectedId === viewId;

  const doAlign = (a: AlignOptions) => () => onAlign(a);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const openWidth = Boolean(anchorEl);

  if (!selected) return null;
  if (!open && !openWidth) return null;

  const margin = align === 'right' ? `0 min(calc(${100 - width / 2}% - 100px), calc(100% - 200px))` : `0 calc(${width / 2}% - 100px)`;

  return (
    <Paper
      className={classes.paper}
      elevation={10}
      style={{
        margin: align === 'center' ? '0 calc(50% - 100px)' : margin,
      }}
    >
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
    </Paper>
  );
};

export default ImageToolbar;
