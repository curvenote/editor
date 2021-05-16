import React from 'react';
import { Popover, Slider } from '@material-ui/core';
import MenuIcon from '../Menu/Icon';

type Props = {
  width: number;
  onWidth: (width: number) => void;
};

const SelectWidth = (props: Props) => {
  const { width, onWidth } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const openWidth = Boolean(anchorEl);

  return (
    <>
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
    </>
  );
};

export default SelectWidth;
