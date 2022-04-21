import React from 'react';
import { makeStyles, createStyles, FormControl, Select, MenuItem } from '@material-ui/core';
import { LinkType, LINK_TYPES } from '../types';

const useStyles = makeStyles(() =>
  createStyles({
    menulist: {
      maxHeight: '15rem',
    },
  }),
);

const LABELS: Record<LinkType, string> = {
  link: 'Link',
  'link-block': 'Card',
};

export function LinkTypeSelect({
  value,
  onChange,
}: {
  onChange: (lang: LinkType) => void;
  value: LinkType;
}) {
  const classes = useStyles();
  return (
    <FormControl>
      <Select
        disableUnderline
        onChange={(e) => {
          onChange(e.target.value as LinkType);
        }}
        value={value}
        MenuProps={{
          className: 'above-modals',
          MenuListProps: {
            className: classes.menulist,
          },
        }}
      >
        {LINK_TYPES.map((name) => (
          <MenuItem key={name} value={name}>
            {LABELS[name]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
