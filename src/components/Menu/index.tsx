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

function TableMenu({
  onClose,
  anchor,
  isOpen,
  command,
}: {
  onClose: () => void;
  anchor: any;
  isOpen: boolean;
  command: any;
}) {
  function item(title: string, action: CommandNames) {
    return (
      <MenuAction
        title={title}
        action={() => {
          command(action);
        }}
      />
    );
  }
  const tableMenu = [
    item('Insert column before', CommandNames.add_column_before),
    item('Insert column after', CommandNames.add_column_after),
    item('Delete column', CommandNames.delete_column),
    item('Insert row before', CommandNames.add_row_before),
    item('Insert row after', CommandNames.add_row_after),
    item('Delete row', CommandNames.delete_row),
    item('Delete table', CommandNames.delete_table),
    item('Merge cells', CommandNames.merge_cells),
    item('Split cell', CommandNames.split_cell),
    item('Toggle header column', CommandNames.toggle_header_column),
    item('Toggle header row', CommandNames.toggle_header_row),
    item('Toggle header cells', CommandNames.toggle_header_cell),
  ];

  return (
    <>
      {isOpen && (
        <Menu
          id="table-menu"
          anchorEl={anchor}
          keepMounted
          open={Boolean(anchor)}
          onClose={onClose}
        >
          <div onClick={() => onClose()}>{tableMenu}</div>
        </Menu>
      )}
    </>
  );
}

const EditorMenu: React.FC<Props> = (props) => {
  const { standAlone, disabled } = props;

  const classes = useStyles();

  const dispatch = useDispatch<Dispatch>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tableAnchor, setTableAnchor] = React.useState<null | HTMLElement>(null);
  const [isTableMenuOpen, setIsTableMenuOpen] = React.useState(false);

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
        table: schema?.nodes.table,
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
  const toggleMark = useCallback(
    (mark?: MarkType) => dispatch(actions.toggleMark(stateId, viewId, mark)),
    [stateId, viewId],
  );
  const wrapInline = (node?: NodeType) => dispatch(actions.insertInlineNode(node));
  const command = useCallback(
    (name: CommandNames) => dispatch(actions.executeCommand(name, viewId)),
    [stateId, viewId],
  );
  const toggleBrackets = useCallback(() => dispatch(toggleCitationBrackets()), []);

  const clickBold = useCallback(() => toggleMark(schema?.marks.strong), [toggleMark]);
  const clickItalic = useCallback(() => toggleMark(schema?.marks.em), [toggleMark]);
  const clickUnderline = useCallback(() => toggleMark(schema?.marks.underline), [toggleMark]);
  const clickStrike = useCallback(() => toggleMark(schema?.marks.strikethrough), [toggleMark]);
  const clickCode = useCallback(() => toggleMark(schema?.marks.code), [toggleMark]);
  const clickSub = useCallback(() => toggleMark(schema?.marks.subscript), [toggleMark]);
  const clickSuper = useCallback(() => toggleMark(schema?.marks.superscript), [toggleMark]);
  const clickUl = useCallback(() => command(CommandNames.bullet_list), [command]);
  const clickGrid = useCallback(() => command(CommandNames.insert_table), [command]);
  const clickOl = useCallback(() => command(CommandNames.ordered_list), [command]);
  const clickLink = useCallback(() => command(CommandNames.link), [command]);
  const clickMath = useCallback(() => wrapInline(schema?.nodes.math), [command]);
  const clickEquation = useCallback(() => command(CommandNames.equation), [command]);
  const clickCite = useCallback(() => command(CommandNames.citation), [command]);
  const clickHr = useCallback(() => command(CommandNames.horizontal_rule), [command]);
  const clickCodeBlk = useCallback(() => command(CommandNames.code), [command]);
  const clickYoutube = useCallback(() => command(CommandNames.youtube), [command]);
  const clickVimeo = useCallback(() => command(CommandNames.vimeo), [command]);
  const clickLoom = useCallback(() => command(CommandNames.loom), [command]);
  const clickMiro = useCallback(() => command(CommandNames.miro), [command]);
  const clickIframe = useCallback(() => command(CommandNames.iframe), [command]);

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

      {parents.table && (
        <>
          <MenuIcon kind="divider" />
          <MenuIcon
            kind="table"
            active={parents.ul}
            disabled={off}
            onClick={(e) => {
              setIsTableMenuOpen(true);
              setTableAnchor(e.currentTarget);
            }}
          />
        </>
      )}
      <TableMenu
        anchor={tableAnchor}
        onClose={() => {
          setIsTableMenuOpen(false);
        }}
        isOpen={isTableMenuOpen}
        command={command}
      />
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

            {!parents.table && (
              <MenuAction title="Table" kind="table" disabled={off} action={clickGrid} />
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
