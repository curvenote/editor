import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectionIsChildOf, selectionIsMarkedWith, getEditorState, getUI,
} from '../store/state/selectors';
import { Dispatch, State } from '../store/types';
import schema from '../prosemirror/schema';
import MenuIcon from './Icon';
import { toggleMark, wrapInList } from '../store/state/actions';
import config from '../config';
import { isEditable } from '../prosemirror/plugins/editable';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: 'fit-content',
    fontSize: 20,
  },
  pad: {
    margin: theme.spacing(0, 2),
  },
  center: {
    margin: '0 auto',
  },
}));

interface Props{
  standAlone?: boolean;
  disabled?: boolean;
  stateKey: string;
}

const EditorMenu = (props: Props) => {
  const {
    standAlone, disabled, stateKey,
  } = props;

  const classes = useStyles();

  const dispatch = useDispatch<Dispatch>();

  const stateId = config.transformKeyToId(stateKey);

  const off = disabled || useSelector((state: State) => (
    !isEditable(getEditorState(state, stateKey))
  ));

  const viewId = useSelector((state: State) => (
    getUI(state).viewId
  ));

  const active = useSelector((state: State) => selectionIsMarkedWith(state, stateId, {
    strong: schema.marks.strong,
    em: schema.marks.em,
    sub: schema.marks.subscript,
    sup: schema.marks.superscript,
    strike: schema.marks.strikethrough,
    underline: schema.marks.underline,
    linked: schema.marks.link,
    code: schema.marks.code,
  }));

  const parents = useSelector((state: State) => selectionIsChildOf(state, stateId, {
    ul: schema.nodes.bullet_list,
    ol: schema.nodes.ordered_list,
  }));

  const clickBulletList = () => dispatch(wrapInList(stateId, viewId, schema.nodes.bullet_list));
  const clickOrderedList = () => dispatch(wrapInList(stateId, viewId, schema.nodes.ordered_list));
  const clickStrong = () => dispatch(toggleMark(stateId, viewId, schema.marks.strong));
  const clickEm = () => dispatch(toggleMark(stateId, viewId, schema.marks.em));
  const clickSub = () => dispatch(toggleMark(stateId, viewId, schema.marks.subscript));
  const clickSup = () => dispatch(toggleMark(stateId, viewId, schema.marks.superscript));
  const clickStrike = () => dispatch(toggleMark(stateId, viewId, schema.marks.strikethrough));
  const clickUnderline = () => dispatch(toggleMark(stateId, viewId, schema.marks.underline));
  const clickCode = () => dispatch(toggleMark(stateId, viewId, schema.marks.code));

  const clickLink = () => {
    // eslint-disable-next-line no-alert
    const href = prompt('Url?');
    if (!href) return;
    dispatch(toggleMark(stateId, viewId, schema.marks.link, { href }));
  };

  return (
    <Grid container alignItems="center" className={`${classes.root} ${standAlone ? classes.center : classes.pad}`} wrap="nowrap">
      {!standAlone && <MenuIcon kind="divider" />}
      <MenuIcon kind="bold" active={active.strong} disabled={off} onClick={clickStrong} />
      <MenuIcon kind="italic" active={active.em} disabled={off} onClick={clickEm} />
      <MenuIcon kind="code" active={active.code} disabled={off} onClick={clickCode} />
      <MenuIcon kind="subscript" active={active.sub} disabled={off} onClick={clickSub} />
      <MenuIcon kind="superscript" active={active.sup} disabled={off} onClick={clickSup} />
      <MenuIcon kind="strikethrough" active={active.strike} disabled={off} onClick={clickStrike} />
      <MenuIcon kind="underline" active={active.underline} disabled={off} onClick={clickUnderline} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="ul" active={parents.ul} disabled={off} onClick={clickBulletList} />
      <MenuIcon kind="ol" active={parents.ol} disabled={off} onClick={clickOrderedList} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="link" active={active.linked} disabled={off} onClick={clickLink} />
    </Grid>
  );
};

EditorMenu.defaultProps = {
  standAlone: false,
  disabled: false,
};

export default EditorMenu;
