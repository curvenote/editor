import React from 'react';
import {
  Tooltip, IconButton, SvgIconProps, makeStyles,
  createStyles, Theme, Paper, Divider, Grid, Popover, Slider,
} from '@material-ui/core';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: 'fit-content',
    marginTop: -15,
    fontSize: 20,
    color: theme.palette.text.secondary,
    '& > div': {
      display: 'inline-block',
    },
    '& svg': {
      margin: 4,
      padding: 2,
      borderRadius: 4,
    },
    '& button:hover': {
      color: 'white',
      backgroundColor: 'transparent',
    },
    '& button:hover svg': {
      backgroundColor: theme.palette.text.secondary,
    },
    '& hr': {
      margin: theme.spacing(0, 0.2),
      height: 20,
    },
  },
  paper: {
    position: 'absolute',
    width: 200,
    overflow: 'hidden',
    height: 33,
    zIndex: 1,
  },
  boldIcon: {
    color: 'white',
    '& svg': {
      backgroundColor: theme.palette.text.secondary,
    },
  },
  popover: {
    overflow: 'visible',
  },
}));

const getButton = (
  title: string,
  click: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  Icon: (props: SvgIconProps) => JSX.Element,
  selected = false,
  className = '',
) => (
  <Tooltip title={title}>
    <div>
      <IconButton
        size="small"
        onClick={(e) => { e.preventDefault(); click(e); }}
        className={selected ? className : ''}
        disableRipple
      >
        <Icon fontSize="small" />
      </IconButton>
    </div>
  </Tooltip>
);

export type AlignOptions = 'left' | 'center' | 'right';

type Props = {
  open: boolean;
  align: AlignOptions;
  width: number;
  onAlign: (align: AlignOptions) => void;
  onWidth: (width: number) => void;
  onDelete: () => void;
};

const ImageToolbar = (props: Props) => {
  const {
    open, width, align, onAlign, onWidth, onDelete,
  } = props;

  const classes = useStyles();

  const doAlign = (a: AlignOptions) => () => onAlign(a);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const openWidth = Boolean(anchorEl);

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
        {getButton('Align left', doAlign('left'), FormatAlignLeftIcon, align === 'left', classes.boldIcon)}
        {getButton('Align center', doAlign('center'), FormatAlignCenterIcon, align === 'center', classes.boldIcon)}
        {getButton('Align right', doAlign('right'), FormatAlignRightIcon, align === 'right', classes.boldIcon)}
        <Divider orientation="vertical" style={{ width: 0 }} />
        {getButton('Adjust width', handleClick, PhotoSizeSelectLargeIcon, openWidth, classes.boldIcon)}
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
        <Divider orientation="vertical" style={{ width: 0 }} />
        {getButton('Remove', onDelete, DeleteIcon)}
      </Grid>
    </Paper>
  );
};

export default ImageToolbar;
