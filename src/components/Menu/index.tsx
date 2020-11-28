import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { MarkType, NodeType } from 'prosemirror-model';
import { selectors, actions } from '../../store';
import { Dispatch, State } from '../../store/types';
import schema from '../../prosemirror/schema';
import MenuIcon from './Icon';
import config from '../../config';
import { isEditable } from '../../prosemirror/plugins/editable';

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
    !isEditable(selectors.getEditorState(state, stateKey))
  ));

  const viewId = useSelector((state: State) => (
    selectors.getUI(state).viewId
  ));

  const active = useSelector((state: State) => selectors.selectionIsMarkedWith(state, stateId, {
    strong: schema.marks.strong,
    em: schema.marks.em,
    sub: schema.marks.subscript,
    sup: schema.marks.superscript,
    strike: schema.marks.strikethrough,
    underline: schema.marks.underline,
    linked: schema.marks.link,
    code: schema.marks.code,
  }));

  const parents = useSelector((state: State) => selectors.selectionIsChildOf(state, stateId, {
    ul: schema.nodes.bullet_list,
    ol: schema.nodes.ordered_list,
  }));

  // Helper functions
  const toggleMark = (mark: MarkType) => () => dispatch(actions.toggleMark(stateId, viewId, mark));
  const wrapInList = (node: NodeType) => () => dispatch(actions.wrapInList(stateId, viewId, node));

  const clickLink = () => {
    // eslint-disable-next-line no-alert
    const href = prompt('Url?');
    if (!href) return;
    dispatch(actions.toggleMark(stateId, viewId, schema.marks.link, { href }));
  };

  return (
    <Grid container alignItems="center" className={`${classes.root} ${standAlone ? classes.center : classes.pad}`} wrap="nowrap">
      {!standAlone && <MenuIcon kind="divider" />}
      <MenuIcon kind="bold" active={active.strong} disabled={off} onClick={toggleMark(schema.marks.strong)} />
      <MenuIcon kind="italic" active={active.em} disabled={off} onClick={toggleMark(schema.marks.em)} />
      <MenuIcon kind="code" active={active.code} disabled={off} onClick={toggleMark(schema.marks.code)} />
      <MenuIcon kind="subscript" active={active.sub} disabled={off} onClick={toggleMark(schema.marks.subscript)} />
      <MenuIcon kind="superscript" active={active.sup} disabled={off} onClick={toggleMark(schema.marks.superscript)} />
      <MenuIcon kind="strikethrough" active={active.strike} disabled={off} onClick={toggleMark(schema.marks.strikethrough)} />
      <MenuIcon kind="underline" active={active.underline} disabled={off} onClick={toggleMark(schema.marks.underline)} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="ul" active={parents.ul} disabled={off} onClick={wrapInList(schema.nodes.bullet_list)} />
      <MenuIcon kind="ol" active={parents.ol} disabled={off} onClick={wrapInList(schema.nodes.ordered_list)} />
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
