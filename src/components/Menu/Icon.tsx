/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Button,
  createStyles,
  Divider,
  IconButton,
  makeStyles,
  SvgIcon,
  Theme,
  Tooltip,
} from '@material-ui/core';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import LinkIcon from '@material-ui/icons/Link';
import CodeIcon from '@material-ui/icons/Code';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import FunctionsIcon from '@material-ui/icons/Functions';
import AddIcon from '@material-ui/icons/Add';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import ShortTextIcon from '@material-ui/icons/ShortText';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import CancelIcon from '@material-ui/icons/Cancel';
import GridIcon from '@material-ui/icons/GridOn';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LooksOneOutlinedIcon from '@material-ui/icons/LooksOneOutlined';
import classNames from 'classnames';
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
// Some inspiration from https://icons8.com/icons/set/insert-row
function RowAboveIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M21,15c-0.7,0.3-1.5,0.5-2.3,0.5c-3.1,0-5.6-2.4-5.8-5.4l-5.4,0V8.7l2.7,0L6.6,5L2.9,8.7l2.8,0v1.4H3.9c-1,0-1.9,0.8-1.9,1.9v6.3c0,1,0.8,1.9,1.9,1.9h15.3c1,0,1.9-0.8,1.9-1.9L21,15z" />
      <path d="M18.7,14.4c-2.6,0-4.7-2.1-4.7-4.7S16.1,5,18.7,5s4.7,2.1,4.7,4.7S21.2,14.4,18.7,14.4z M21.5,10.5V8.7h-1.9V6.8h-1.8v1.9h-1.9v1.8h1.9v1.9h1.8v-1.9H21.5z" />
    </SvgIcon>
  );
}
function RowBelowIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M19.1,5H3.9C2.8,5,2,5.8,2,6.9v6.3c0,1,0.8,1.9,1.9,1.9h1.8v1.4l-2.8,0l3.6,3.7l3.6-3.7l-2.7,0V15l5.4,0c0.2-3,2.7-5.4,5.8-5.4c0.8,0,1.6,0.2,2.3,0.5l0-3.2C21,5.8,20.2,5,19.1,5z" />
      <path d="M23.3,15.4c0,2.6-2.1,4.7-4.7,4.7S14,17.9,14,15.4s2.1-4.7,4.7-4.7S23.3,12.8,23.3,15.4z M19.6,14.6v-1.9h-1.8v1.9h-1.9v1.8h1.9v1.9h1.8v-1.9h1.9v-1.8H19.6z" />
    </SvgIcon>
  );
}
function RowDelete(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M10.9,12.1l-1.2,1.2l1.2,1.2l1.2-1.2l1.2,1.2l1.2-1.2l-1.2-1.2l1.2-1.2l-1.2-1.2l-1.2,1.2l-1.2-1.2l-1.2,1.2L10.9,12.1z" />
      <path d="M2.6,15.3V8.9c0-1,0.8-1.8,1.8-1.8h15.4c1,0,1.8,0.8,1.8,1.8v6.4c0,1-0.8,1.8-1.8,1.8H4.4C3.4,17.1,2.6,16.3,2.6,15.3zM15.9,12.1c0-2.1-1.7-3.8-3.8-3.8S8.2,10,8.2,12.1s1.7,3.8,3.8,3.8S15.9,14.2,15.9,12.1z" />
    </SvgIcon>
  );
}
function ColLeftIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M8.8,10.1V7.4h1.4l0,5.4c3,0.2,5.4,2.7,5.4,5.8c0,0.8-0.2,1.6-0.5,2.3h3.2c1.1,0,1.9-0.9,1.9-1.9V3.7c0-1.1-0.9-1.9-1.9-1.9h-6.2c-1.1,0-1.9,0.9-1.9,1.9v1.9H8.8V2.8L5.1,6.4L8.8,10.1z" />
      <path d="M9.8,23.2c-2.6,0-4.7-2.1-4.7-4.7s2.1-4.7,4.7-4.7s4.7,2.1,4.7,4.7S12.4,23.2,9.8,23.2z M10.6,19.4h1.9v-1.8h-1.9v-1.9H8.8v1.9H6.9v1.8h1.9v1.9h1.8V19.4z" />
    </SvgIcon>
  );
}
function ColRightIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M20.2,6.4l-3.7-3.6l0,2.8h-1.4V3.7c0-1-0.8-1.9-1.9-1.9H7c-1,0-1.9,0.8-1.9,1.9V19c0,1,0.8,1.9,1.9,1.9l3.2,0c-0.3-0.7-0.5-1.5-0.5-2.3c0-3.1,2.4-5.6,5.4-5.8l0-5.4h1.4l0,2.7L20.2,6.4z" />
      <path d="M10.8,18.5c0-2.6,2.1-4.7,4.7-4.7s4.7,2.1,4.7,4.7s-2.1,4.7-4.7,4.7S10.8,21.1,10.8,18.5z M14.7,21.3h1.8v-1.9h1.9v-1.8h-1.9v-1.9h-1.8v1.9h-1.9v1.8h1.9V21.3z" />
    </SvgIcon>
  );
}
function ColDelete(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M12.1,13.2l1.2,1.2l1.2-1.2l-1.2-1.2l1.2-1.2l-1.2-1.2l-1.2,1.2l-1.2-1.2l-1.2,1.2l1.2,1.2l-1.2,1.2l1.2,1.2L12.1,13.2z" />
      <path d="M15.3,21.6H8.8c-1,0-1.8-0.8-1.8-1.8V4.4c0-1,0.8-1.8,1.8-1.8h6.4c1,0,1.8,0.8,1.8,1.8v15.4C17.1,20.8,16.3,21.6,15.3,21.6zM12.1,8.3c-2.1,0-3.8,1.7-3.8,3.8s1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8S14.2,8.3,12.1,8.3z" />
    </SvgIcon>
  );
}
function BracketsIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M15 4v2h3v12h-3v2h5V4M4 4v16h5v-2H6V6h3V4H4z" />
    </SvgIcon>
  );
}

const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
const deMacify = (title: string | React.ReactElement) =>
  mac || typeof title !== 'string' ? title : title.replace('⌘', 'Ctrl-');

const icons = {
  table: { help: 'Create Table', Icon: GridIcon },
  cancel: { help: 'Cancel', Icon: CancelIcon },
  enterSave: { help: 'Save', Icon: KeyboardReturnIcon },
  bold: { help: 'Bold ⌘B', Icon: FormatBoldIcon },
  italic: { help: 'Italic ⌘I', Icon: FormatItalicIcon },
  code: { help: 'Code ⌘⇧C', Icon: CodeIcon },
  subscript: { help: 'Subscript', Icon: SubscriptIcon },
  superscript: { help: 'Superscript', Icon: SuperscriptIcon },
  strikethrough: { help: 'Strikethrough', Icon: StrikethroughSIcon },
  underline: { help: 'Underline ⌘U', Icon: FormatUnderlinedIcon },
  ul: { help: 'Bullet Point List ⌘⇧8', Icon: FormatListBulletedIcon },
  ol: { help: 'Ordered List ⌘⇧7', Icon: FormatListNumberedIcon },
  link: { help: 'Link ⌘K', Icon: LinkIcon },
  left: { help: 'Align Left', Icon: FormatAlignLeftIcon },
  center: { help: 'Align Center', Icon: FormatAlignCenterIcon },
  right: { help: 'Align Right', Icon: FormatAlignRightIcon },
  imageWidth: { help: 'Adjust Width', Icon: PhotoSizeSelectLargeIcon },
  remove: { help: 'Remove', Icon: DeleteIcon },
  unlink: { help: 'Unlink', Icon: LinkOffIcon },
  math: { help: 'Inline Math', Icon: FunctionsIcon },
  more: { help: 'Insert', Icon: AddIcon },
  expand: { help: 'More Options', Icon: ExpandMoreIcon },
  open: { help: 'Open in New Tab', Icon: OpenInNewIcon },
  brackets: { help: 'Toggle Brackets', Icon: BracketsIcon },
  active: { help: 'Attention', Icon: NewReleasesIcon },
  success: { help: 'Success', Icon: CheckCircleIcon },
  info: { help: 'Information', Icon: InfoIcon },
  warning: { help: 'Warning', Icon: WarningIcon },
  danger: { help: 'Danger', Icon: ErrorIcon },
  lift: { help: 'Remove from Container', Icon: SettingsOverscanIcon },
  numbered: { help: 'Toggle Numbering', Icon: LooksOneIcon },
  caption: { help: 'Show/Hide Caption', Icon: ShortTextIcon },
  label: { help: 'Reference ID', Icon: LocalOfferIcon },
  rowAbove: { help: 'Insert Row Above', Icon: RowAboveIcon },
  rowBelow: { help: 'Insert Row Below', Icon: RowBelowIcon },
  rowDelete: { help: 'Delete Row', Icon: RowDelete },
  colLeft: { help: 'Insert Column Left', Icon: ColLeftIcon },
  colRight: { help: 'Insert Column Right', Icon: ColRightIcon },
  colDelete: { help: 'Delete Column', Icon: ColDelete },
  lineNumber: { help: 'Toggle Line Number', Icon: LooksOneOutlinedIcon },
};

export type IconTypes = keyof typeof icons | 'divider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      display: 'inline-block',
      '& button:hover': {
        backgroundColor: 'transparent',
      },
      '& button.active svg, button:hover svg': {
        backgroundColor: theme.palette.text.secondary,
        color: 'white',
      },
      '& button:hover svg.dangerous, svg.error': {
        backgroundColor: 'transparent',
        color: theme.palette.error.main,
      },
      '& svg': {
        margin: 4,
        padding: 2,
        borderRadius: 4,
      },
    },
    hr: {
      margin: theme.spacing(0, 0.5),
      height: 20,
    },
    button: {
      margin: theme.spacing(0, 0.5),
      textTransform: 'none',
    },
  }),
);

type Props = {
  kind: IconTypes;
  disabled?: boolean;
  active?: boolean;
  dangerous?: boolean;
  error?: boolean;
  title?: string;
  text?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const MenuIcon: React.FC<Props> = (props) => {
  const { kind, active, dangerous, error, disabled, onClick, title, text } = props;

  const classes = useStyles();

  if (kind === 'divider') return <Divider className={classes.hr} orientation="vertical" />;

  const { help, Icon } = icons[kind];

  if (text) {
    return (
      <Button
        disabled={disabled}
        className={classes.button}
        size="small"
        onClickCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick?.(e);
        }}
        disableRipple
      >
        {text}
        <Icon fontSize="small" className={classNames({ dangerous, error })} />
      </Button>
    );
  }

  return (
    <Tooltip title={title || deMacify(help)}>
      <div className={classes.root}>
        <IconButton
          disabled={disabled}
          className={active ? 'active' : ''}
          size="small"
          onClickCapture={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClick?.(e);
          }}
          disableRipple
        >
          <Icon fontSize="small" className={classNames({ dangerous, error })} />
        </IconButton>
      </div>
    </Tooltip>
  );
};

MenuIcon.defaultProps = {
  disabled: false,
  active: false,
  dangerous: false,
  error: false,
  onClick: undefined,
  title: undefined,
  text: undefined,
};

export default React.memo(MenuIcon);
