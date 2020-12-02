import React, { useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Menu, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { MarkType, NodeType } from 'prosemirror-model';
import { CommandNames } from '../../store/suggestion/commands';
import { selectors, actions } from '../../store';
import { Dispatch, State } from '../../store/types';
import schema from '../../prosemirror/schema';
import MenuIcon from './Icon';
import { opts } from '../../connect';
import { isEditable } from '../../prosemirror/plugins/editable';
import MenuAction from './Action';

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
  stateKey: any;
  standAlone?: boolean;
  disabled?: boolean;
}

const EditorMenu = (props: Props) => {
  const {
    standAlone, disabled, stateKey,
  } = props;

  const classes = useStyles();

  const dispatch = useDispatch<Dispatch>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onOpen = useCallback(
    (event: React.MouseEvent<any>) => setAnchorEl(event.currentTarget), [],
  );
  const onClose = useCallback(() => setAnchorEl(null), []);

  const stateId = opts.transformKeyToId(stateKey);


  let off = useSelector((state: State) => (
    !isEditable(selectors.getEditorState(state, stateKey)?.state)
  ));
  off = off || (disabled as boolean);

  const viewId = useSelector((state: State) => (
    selectors.getEditorUI(state).viewId
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
    math: schema.nodes.math,
  }));

  // TODO: make this memoized and move to just commands

  // Helper functions
  const toggleMark = (mark: MarkType) => () => dispatch(actions.toggleMark(stateId, viewId, mark));
  const wrapInline = (node: NodeType) => () => dispatch(actions.insertInlineNode(node));
  const command = (name: CommandNames) => () => dispatch(actions.executeCommand(name, viewId));

  return (
    <Grid container alignItems="center" className={`${classes.root} ${standAlone ? classes.center : classes.pad}`} wrap="nowrap">
      {!standAlone && <MenuIcon kind="divider" />}
      <MenuIcon kind="bold" active={active.strong} disabled={off} onClick={toggleMark(schema.marks.strong)} />
      <MenuIcon kind="italic" active={active.em} disabled={off} onClick={toggleMark(schema.marks.em)} />
      <MenuIcon kind="underline" active={active.underline} disabled={off} onClick={toggleMark(schema.marks.underline)} />
      <MenuIcon kind="strikethrough" active={active.strike} disabled={off} onClick={toggleMark(schema.marks.strikethrough)} />
      <MenuIcon kind="code" active={active.code} disabled={off} onClick={toggleMark(schema.marks.code)} />
      <MenuIcon kind="subscript" active={active.sub} disabled={off} onClick={toggleMark(schema.marks.subscript)} />
      <MenuIcon kind="superscript" active={active.sup} disabled={off} onClick={toggleMark(schema.marks.superscript)} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="ul" active={parents.ul} disabled={off} onClick={command(CommandNames.bullet_list)} />
      <MenuIcon kind="ol" active={parents.ol} disabled={off} onClick={command(CommandNames.ordered_list)} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="link" active={active.linked} disabled={off} onClick={command(CommandNames.link)} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="more" disabled={off} onClick={onOpen} aria-controls="insert-menu" />
      {Boolean(anchorEl) && (
        <Menu
          id="insert-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={onClose}
        >
          <div onClick={() => onClose()}>
            <MenuAction kind="math" disabled={off} action={wrapInline(schema.nodes.math)} title="Inline Math" />
            <MenuAction kind="math" disabled={off} action={command(CommandNames.equation)} title="Equation Block" />
            <MenuAction kind="hr" disabled={off} action={command(CommandNames.horizontal_rule)} title="Divider" />
            <MenuAction kind="code" disabled={off} action={command(CommandNames.code)} title="Code" />
          </div>
        </Menu>
      )}
    </Grid>
  );
};

EditorMenu.defaultProps = {
  standAlone: false,
  disabled: false,
};

export default EditorMenu;
