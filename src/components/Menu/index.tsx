import React, { useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Menu, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { MarkType, NodeType } from 'prosemirror-model';
import isEqual from 'lodash.isequal';
import { CommandNames } from '../../store/suggestion/commands';
import { selectors, actions } from '../../store';
import { Dispatch, State } from '../../store/types';
import MenuIcon from './Icon';
import { isEditable } from '../../prosemirror/plugins/editable';
import MenuAction from './Action';
import { toggleCitationBrackets } from '../../store/actions/editor';

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
}

const EditorMenu = (props: Props) => {
  const { standAlone, disabled } = props;

  const classes = useStyles();

  const dispatch = useDispatch<Dispatch>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onOpen = useCallback(
    (event: React.MouseEvent<any>) => setAnchorEl(event.currentTarget), [],
  );
  const onClose = useCallback(() => setAnchorEl(null), []);

  const stateId = useSelector((state: State) => selectors.getEditorUI(state).stateId);
  const viewId = useSelector((state: State) => selectors.getEditorUI(state).viewId);
  let off = useSelector((state: State) => (
    !isEditable(selectors.getEditorState(state, stateId)?.state)
  ));
  const schema = useSelector((state: State) => (
    selectors.getEditorState(state, stateId)?.state?.schema
  ));
  off = off || (disabled as boolean);

  const active = useSelector((state: State) => selectors.selectionIsMarkedWith(state, stateId, {
    strong: schema?.marks.strong,
    em: schema?.marks.em,
    sub: schema?.marks.subscript,
    sup: schema?.marks.superscript,
    strike: schema?.marks.strikethrough,
    underline: schema?.marks.underline,
    linked: schema?.marks.link,
    code: schema?.marks.code,
  }), isEqual);

  const parents = useSelector((state: State) => selectors.selectionIsChildOf(state, stateId, {
    ul: schema?.nodes.bullet_list,
    ol: schema?.nodes.ordered_list,
    math: schema?.nodes.math,
    cite_group: schema?.nodes.cite_group,
  }), isEqual);

  const nodes = useSelector((state: State) => selectors.selectionIsThisNodeType(state, stateId, {
    cite: schema?.nodes.cite,
  }), isEqual);

  // TODO: make this memoized? Needs to be done carefully.

  // Helper functions
  const toggleMark = (mark?: MarkType) => () => dispatch(actions.toggleMark(stateId, viewId, mark));
  const wrapInline = (node?: NodeType) => () => dispatch(actions.insertInlineNode(node));
  const command = (name: CommandNames) => () => dispatch(actions.executeCommand(name, viewId));
  const toggleBrackets = useCallback(() => dispatch(toggleCitationBrackets()), []);

  return (
    <Grid container alignItems="center" className={`${classes.root} ${standAlone ? classes.center : classes.pad}`} wrap="nowrap">
      {!standAlone && <MenuIcon kind="divider" />}
      <MenuIcon kind="bold" active={active.strong} disabled={off} onClick={toggleMark(schema?.marks.strong)} />
      <MenuIcon kind="italic" active={active.em} disabled={off} onClick={toggleMark(schema?.marks.em)} />
      <MenuIcon kind="underline" active={active.underline} disabled={off} onClick={toggleMark(schema?.marks.underline)} />
      <MenuIcon kind="strikethrough" active={active.strike} disabled={off} onClick={toggleMark(schema?.marks.strikethrough)} />
      <MenuIcon kind="code" active={active.code} disabled={off} onClick={toggleMark(schema?.marks.code)} />
      <MenuIcon kind="subscript" active={active.sub} disabled={off} onClick={toggleMark(schema?.marks.subscript)} />
      <MenuIcon kind="superscript" active={active.sup} disabled={off} onClick={toggleMark(schema?.marks.superscript)} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="ul" active={parents.ul} disabled={off || !schema?.nodes.bullet_list} onClick={command(CommandNames.bullet_list)} />
      <MenuIcon kind="ol" active={parents.ol} disabled={off || !schema?.nodes.ordered_list} onClick={command(CommandNames.ordered_list)} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="link" active={active.linked} disabled={off} onClick={command(CommandNames.link)} />
      {nodes.cite && <MenuIcon kind="brackets" active={parents.cite_group} disabled={off} onClick={toggleBrackets} />}
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
            {schema?.nodes.math && <MenuAction kind="math" disabled={off} action={wrapInline(schema?.nodes.math)} title="Inline Math" />}
            {schema?.nodes.equation && <MenuAction kind="math" disabled={off} action={command(CommandNames.equation)} title="Equation Block" />}
            {schema?.nodes.cite && <MenuAction kind="link" disabled={off} action={command(CommandNames.citation)} title="Citation" />}
            {schema?.nodes.horizontal_rule && <MenuAction kind="hr" disabled={off} action={command(CommandNames.horizontal_rule)} title="Divider" />}
            {schema?.nodes.code_block && <MenuAction kind="code" disabled={off} action={command(CommandNames.code)} title="Code" />}
            {schema?.nodes.iframe && <MenuAction kind="youtube" disabled={off} action={command(CommandNames.youtube)} title="YouTube Video" />}
            {schema?.nodes.iframe && <MenuAction kind="video" disabled={off} action={command(CommandNames.vimeo)} title="Vimeo Video" />}
            {schema?.nodes.iframe && <MenuAction kind="video" disabled={off} action={command(CommandNames.loom)} title="Loom Video" />}
            {schema?.nodes.iframe && <MenuAction kind="iframe" disabled={off} action={command(CommandNames.miro)} title="Miro Board" />}
            {schema?.nodes.iframe && <MenuAction kind="iframe" disabled={off} action={command(CommandNames.iframe)} title="Embed an IFrame" />}
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
