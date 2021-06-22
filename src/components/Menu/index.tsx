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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

interface Props {
  standAlone?: boolean;
  disabled?: boolean;
}

const EditorMenu: React.FC<Props> = (props) => {
  const { standAlone, disabled } = props;

  const classes = useStyles();

  const dispatch = useDispatch<Dispatch>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onOpen = useCallback(
    (event: React.MouseEvent<any>) => setAnchorEl(event.currentTarget),
    [],
  );
  const onClose = useCallback(() => setAnchorEl(null), []);

  const stateId = useSelector((state: State) => selectors.getEditorUI(state).stateId);
  const viewId = useSelector((state: State) => selectors.getEditorUI(state).viewId);
  let off = useSelector(
    (state: State) => !isEditable(selectors.getEditorState(state, stateId)?.state),
  );
  const schema = useSelector(
    (state: State) => selectors.getEditorState(state, stateId)?.state?.schema,
  );
  off = off || (disabled as boolean);

  const active = useSelector(
    (state: State) =>
      selectors.selectionIsMarkedWith(state, stateId, {
        strong: schema?.marks.strong,
        em: schema?.marks.em,
        sub: schema?.marks.subscript,
        sup: schema?.marks.superscript,
        strike: schema?.marks.strikethrough,
        underline: schema?.marks.underline,
        linked: schema?.marks.link,
        code: schema?.marks.code,
      }),
    isEqual,
  );

  const parents = useSelector(
    (state: State) =>
      selectors.selectionIsChildOf(state, stateId, {
        ul: schema?.nodes.bullet_list,
        ol: schema?.nodes.ordered_list,
        math: schema?.nodes.math,
        cite_group: schema?.nodes.cite_group,
      }),
    isEqual,
  );

  const nodes = useSelector(
    (state: State) =>
      selectors.selectionIsThisNodeType(state, stateId, {
        cite: schema?.nodes.cite,
      }),
    isEqual,
  );

  // TODO: make this memoized? Needs to be done carefully.

  // Helper functions
  const toggleMark = (mark?: MarkType) => dispatch(actions.toggleMark(stateId, viewId, mark));
  const wrapInline = (node?: NodeType) => dispatch(actions.insertInlineNode(node));
  const command = (name: CommandNames) => dispatch(actions.executeCommand(name, viewId));
  const toggleBrackets = useCallback(() => dispatch(toggleCitationBrackets()), []);

  const clickBold = useCallback(() => toggleMark(schema?.marks.strong), [stateId, viewId]);
  const clickItalic = useCallback(() => toggleMark(schema?.marks.em), [stateId, viewId]);
  const clickUnderline = useCallback(() => toggleMark(schema?.marks.underline), [stateId, viewId]);
  const clickStrike = useCallback(() => toggleMark(schema?.marks.strikethrough), [stateId, viewId]);
  const clickCode = useCallback(() => toggleMark(schema?.marks.code), [stateId, viewId]);
  const clickSub = useCallback(() => toggleMark(schema?.marks.subscript), [stateId, viewId]);
  const clickSuper = useCallback(() => toggleMark(schema?.marks.superscript), [stateId, viewId]);
  const clickUl = useCallback(() => command(CommandNames.bullet_list), [stateId, viewId]);
  const clickOl = useCallback(() => command(CommandNames.ordered_list), [stateId, viewId]);
  const clickLink = useCallback(() => command(CommandNames.link), [stateId, viewId]);
  const clickMath = useCallback(() => wrapInline(schema?.nodes.math), [stateId, viewId]);
  const clickEquation = useCallback(() => command(CommandNames.equation), [stateId, viewId]);
  const clickCite = useCallback(() => command(CommandNames.citation), [stateId, viewId]);
  const clickHr = useCallback(() => command(CommandNames.horizontal_rule), [stateId, viewId]);
  const clickCodeBlk = useCallback(() => command(CommandNames.code), [stateId, viewId]);
  const clickYoutube = useCallback(() => command(CommandNames.youtube), [stateId, viewId]);
  const clickVimeo = useCallback(() => command(CommandNames.vimeo), [stateId, viewId]);
  const clickLoom = useCallback(() => command(CommandNames.loom), [stateId, viewId]);
  const clickMiro = useCallback(() => command(CommandNames.miro), [stateId, viewId]);
  const clickIframe = useCallback(() => command(CommandNames.iframe), [stateId, viewId]);

  return (
    <Grid
      container
      alignItems="center"
      className={`${classes.root} ${standAlone ? classes.center : classes.pad}`}
      wrap="nowrap"
    >
      {!standAlone && <MenuIcon kind="divider" />}
      <MenuIcon kind="bold" active={active.strong} disabled={off} onClick={clickBold} />
      <MenuIcon kind="italic" active={active.em} disabled={off} onClick={clickItalic} />
      <MenuIcon
        kind="underline"
        active={active.underline}
        disabled={off}
        onClick={clickUnderline}
      />
      <MenuIcon kind="strikethrough" active={active.strike} disabled={off} onClick={clickStrike} />
      <MenuIcon kind="code" active={active.code} disabled={off} onClick={clickCode} />
      <MenuIcon kind="subscript" active={active.sub} disabled={off} onClick={clickSub} />
      <MenuIcon kind="superscript" active={active.sup} disabled={off} onClick={clickSuper} />
      <MenuIcon kind="divider" />
      <MenuIcon
        kind="ul"
        active={parents.ul}
        disabled={off || !schema?.nodes.bullet_list}
        onClick={clickUl}
      />
      <MenuIcon
        kind="ol"
        active={parents.ol}
        disabled={off || !schema?.nodes.ordered_list}
        onClick={clickOl}
      />
      <MenuIcon kind="divider" />
      <MenuIcon kind="link" active={active.linked} disabled={off} onClick={clickLink} />
      {nodes.cite && (
        <MenuIcon
          kind="brackets"
          active={parents.cite_group}
          disabled={off}
          onClick={toggleBrackets}
        />
      )}
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
            {schema?.nodes.math && (
              <MenuAction kind="math" disabled={off} action={clickMath} title="Inline Math" />
            )}
            {schema?.nodes.equation && (
              <MenuAction
                kind="math"
                disabled={off}
                action={clickEquation}
                title="Equation Block"
              />
            )}
            {schema?.nodes.cite && (
              <MenuAction kind="link" disabled={off} action={clickCite} title="Citation" />
            )}
            {schema?.nodes.horizontal_rule && (
              <MenuAction kind="hr" disabled={off} action={clickHr} title="Divider" />
            )}
            {schema?.nodes.code_block && (
              <MenuAction kind="code" disabled={off} action={clickCodeBlk} title="Code" />
            )}
            {schema?.nodes.iframe && (
              <MenuAction
                kind="youtube"
                disabled={off}
                action={clickYoutube}
                title="YouTube Video"
              />
            )}
            {schema?.nodes.iframe && (
              <MenuAction kind="video" disabled={off} action={clickVimeo} title="Vimeo Video" />
            )}
            {schema?.nodes.iframe && (
              <MenuAction kind="video" disabled={off} action={clickLoom} title="Loom Video" />
            )}
            {schema?.nodes.iframe && (
              <MenuAction kind="iframe" disabled={off} action={clickMiro} title="Miro Board" />
            )}
            {schema?.nodes.iframe && (
              <MenuAction
                kind="iframe"
                disabled={off}
                action={clickIframe}
                title="Embed an IFrame"
              />
            )}
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
