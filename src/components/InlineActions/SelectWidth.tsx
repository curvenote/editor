import React from 'react';
import { Popover, Slider } from '@material-ui/core';
import { DEFAULT_IMAGE_WIDTH } from '@curvenote/schema';
import MenuIcon from '../Menu/Icon';

type Props = {
  width: number | null;
  onWidth: (width: number) => void;
};

const SelectWidth: React.FC<Props> = (props) => {
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
            defaultValue={width ?? DEFAULT_IMAGE_WIDTH}
            step={10}
            marks
            min={10}
            max={100}
            onChangeCommitted={(e, v) => {
              handleClose();
              onWidth(v as number);
            }}
          />
        </div>
      </Popover>
    </>
  );
};

export default SelectWidth;
