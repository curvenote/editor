/* eslint-disable react/prop-types */
import React from 'react';
import { MenuItem, Typography } from '@material-ui/core';
import FunctionsIcon from '@material-ui/icons/Functions';
import CodeIcon from '@material-ui/icons/Code';
import RemoveIcon from '@material-ui/icons/Remove';

const icons = {
  math: FunctionsIcon,
  code: CodeIcon,
  hr: RemoveIcon,
};

export type IconTypes = keyof typeof icons;

export type MenuActionProps = {
  kind: IconTypes;
  title?: string | React.ReactNode;
  action?: (() => void) | null;
  disabled?: boolean;
};

export const Action = (props: MenuActionProps) => {
  const {
    kind, title, action, disabled,
  } = props;
  const click = action ?? (() => null); // Do we need to close/stop prop?
  const Icon = icons[kind];
  return (
    <MenuItem onClick={click} disabled={disabled}>
      <Typography>
        {Icon && (
          <Icon
            fontSize="small"
            style={{
              position: 'relative', top: 3, marginRight: 10, color: '#aaa',
            }}
            color="inherit"
          />
        )}
        {` ${title}`}
      </Typography>
    </MenuItem>
  );
};

Action.defaultProps = {
  title: '',
  action: () => null,
  disabled: false,
};

export default Action;
