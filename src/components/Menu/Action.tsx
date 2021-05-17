/* eslint-disable react/prop-types */
import React from 'react';
import {
  createStyles, makeStyles, MenuItem, Typography,
} from '@material-ui/core';
import FunctionsIcon from '@material-ui/icons/Functions';
import CodeIcon from '@material-ui/icons/Code';
import RemoveIcon from '@material-ui/icons/Remove';
import YouTubeIcon from '@material-ui/icons/YouTube';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import LinkIcon from '@material-ui/icons/Link';

const icons = {
  math: FunctionsIcon,
  code: CodeIcon,
  hr: RemoveIcon,
  youtube: YouTubeIcon,
  video: OndemandVideoIcon,
  iframe: WebAssetIcon,
  link: LinkIcon,
};

const useStyles = makeStyles(() => createStyles({
  root: {
    minWidth: 115,
  },
  icon: {
    position: 'relative',
    top: 3,
    marginRight: 10,
    color: '#aaa',
  },
}));

export type IconTypes = keyof typeof icons;

export type MenuActionProps = {
  kind?: IconTypes;
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  action?: (() => void);
  disabled?: boolean;
  selected?: boolean;
};

const MenuAction = (props: MenuActionProps) => {
  const {
    kind, title, action, disabled, children, selected,
  } = props;
  const classes = useStyles();
  const Icon = kind && icons[kind];
  return (
    <MenuItem onClick={action} disabled={disabled} selected={selected}>
      <Typography className={classes.root}>
        {Icon && (
          <Icon
            fontSize="small"
            className={classes.icon}
            color="inherit"
          />
        )}
        {` ${title}`}
      </Typography>
      {children}
    </MenuItem>
  );
};

MenuAction.defaultProps = {
  kind: undefined,
  title: '',
  action: undefined,
  disabled: false,
  selected: false,
};

export default MenuAction;
