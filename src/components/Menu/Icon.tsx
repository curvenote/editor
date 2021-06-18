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
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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

const MenuIcon = (props: Props) => {
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
