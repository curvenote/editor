/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  createStyles, IconButton, makeStyles, SvgIcon, Theme, Tooltip,
} from '@material-ui/core';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import LinkIcon from '@material-ui/icons/Link';
import CodeIcon from '@material-ui/icons/Code';
// import AddIcon from '@material-ui/icons/Add';
// import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
// import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
// import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
// import ImageIcon from '@material-ui/icons/Image';
// import TuneIcon from '@material-ui/icons/Tune';

// https://iconify.design/icon-sets/mdi/format-superscript.html
function SubscriptIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M16 7.41L11.41 12L16 16.59L14.59 18L10 13.41L5.41 18L4 16.59L8.59 12L4 7.41L5.41 6L10 10.59L14.59 6L16 7.41m5.85 13.62h-4.88v-1l.89-.8c.76-.65 1.32-1.19 1.7-1.63c.37-.44.56-.85.57-1.24a.898.898 0 0 0-.27-.7c-.18-.16-.47-.28-.86-.28c-.31 0-.58.06-.84.18l-.66.38l-.45-1.17c.27-.21.59-.39.98-.53s.82-.24 1.29-.24c.78.04 1.38.25 1.78.66c.4.41.62.93.62 1.57c-.01.56-.19 1.08-.54 1.55c-.34.47-.76.92-1.27 1.36l-.64.52v.02h2.58v1.35z" />
    </SvgIcon>
  );
}
function SuperscriptIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M16 7.41L11.41 12L16 16.59L14.59 18L10 13.41L5.41 18L4 16.59L8.59 12L4 7.41L5.41 6L10 10.59L14.59 6L16 7.41M21.85 9h-4.88V8l.89-.82c.76-.64 1.32-1.18 1.7-1.63c.37-.44.56-.85.57-1.23a.884.884 0 0 0-.27-.7c-.18-.19-.47-.28-.86-.29c-.31.01-.58.07-.84.17l-.66.39l-.45-1.17c.27-.22.59-.39.98-.53S18.85 2 19.32 2c.78 0 1.38.2 1.78.61c.4.39.62.93.62 1.57c-.01.56-.19 1.08-.54 1.55c-.34.48-.76.93-1.27 1.36l-.64.52v.02h2.58V9z" />
    </SvgIcon>
  );
}

const icons = {
  bold: { title: 'Bold ⌘B', Icon: FormatBoldIcon },
  italic: { title: 'Italic ⌘I', Icon: FormatItalicIcon },
  code: { title: 'Code ⌘⇧C', Icon: CodeIcon },
  subscript: { title: 'Subscript', Icon: SubscriptIcon },
  superscript: { title: 'Superscript', Icon: SuperscriptIcon },
  strikethrough: { title: 'Strikethrough', Icon: StrikethroughSIcon },
  underline: { title: 'Underline ⌘U', Icon: FormatUnderlinedIcon },
  ul: { title: 'Bullet Point List ⌘⇧8', Icon: FormatListBulletedIcon },
  ol: { title: 'Ordered List ⌘⇧7', Icon: FormatListNumberedIcon },
  link: { title: 'Link ⌘K', Icon: LinkIcon },
};

export type IconTypes = keyof typeof icons;


const useStyles = makeStyles((theme: Theme) => createStyles({
  boldIcon: {
    color: 'white',
    '& svg': {
      backgroundColor: theme.palette.text.secondary,
    },
  },
}));

type Props = {
  kind: IconTypes;
  disabled: boolean;
  active: boolean;
  onClick: () => void;
};

const MenuIcon = (props: Props) => {
  const {
    kind, active, disabled, onClick,
  } = props;

  const classes = useStyles();

  const { title, Icon } = icons[kind];

  return (
    <Tooltip title={title}>
      <div>
        <IconButton
          disabled={disabled}
          className={active ? classes.boldIcon : ''}
          size="small"
          onClickCapture={(e) => { e.stopPropagation(); e.preventDefault(); onClick(); }}
          disableRipple
        >
          <Icon fontSize="small" />
        </IconButton>
      </div>
    </Tooltip>
  );
};

export default MenuIcon;
