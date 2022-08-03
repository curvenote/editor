import React, { useCallback } from 'react';
import { makeStyles, createStyles, Grid, Menu } from '@material-ui/core';
import { Node } from 'prosemirror-model';
import { nodeNames } from '@curvenote/schema';
import { findParentNode } from '@curvenote/prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { updateNodeAttrs, wrapInHeading } from '../../store/actions';
import { getEditorState } from '../../store/selectors';
import { Dispatch, State } from '../../store';
import { ActionProps } from './utils';
import MenuAction from '../Menu/Action';
import Keyboard from '../Keyboard';
import { getNodeFromSelection } from '../../store/ui/utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'fit-content',
      fontSize: 20,
      flexWrap: 'nowrap',
    },
  }),
);

const ABOVE_MODALS = { zIndex: 1301 };

function HeadingActions(props: ActionProps) {
  const { stateId, viewId } = props;
  const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector((s: State) => getEditorState(s, stateId)?.state);
  const parent =
    state?.selection &&
    findParentNode((n: Node) => n.type.name === nodeNames.heading)(state?.selection);
  const node = parent?.node ?? getNodeFromSelection(state?.selection);
  const pos = parent?.pos ?? state?.selection?.from;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onOpen = useCallback(
    (event: React.MouseEvent<any>) => setAnchorEl(event.currentTarget),
    [],
  );
  const onClose = useCallback(() => setAnchorEl(null), []);

  if (!node || pos == null) return null;
  // If the node changes, set open label to false
  const { numbered, level } = node.attrs;

  const onNumbered = () =>
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { numbered: !numbered }, false));
  const onLevel = (l: number) => () => {
    onClose();
    if (!state?.schema) return;
    if (l === 0) {
      dispatch(wrapInHeading(state?.schema, 0));
      return;
    }
    // This maintains the section label/number info
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { level: l }, false));
  };

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <MenuIcon
        kind="expand"
        onClick={onOpen}
        aria-controls="insert-menu"
        text={`Heading ${level}`}
      />
      <Menu
        id="insert-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        style={ABOVE_MODALS}
      >
        <MenuAction action={onLevel(0)} selected={level === 0} title="Paragraph">
          <Keyboard shortcut="Mod-Alt-0" />
        </MenuAction>
        <MenuAction action={onLevel(1)} selected={level === 1} title="Heading 1">
          <Keyboard shortcut="Mod-Alt-1" />
        </MenuAction>
        <MenuAction action={onLevel(2)} selected={level === 2} title="Heading 2">
          <Keyboard shortcut="Mod-Alt-2" />
        </MenuAction>
        <MenuAction action={onLevel(3)} selected={level === 3} title="Heading 3">
          <Keyboard shortcut="Mod-Alt-3" />
        </MenuAction>
        <MenuAction action={onLevel(4)} selected={level === 4} title="Heading 4">
          <Keyboard shortcut="Mod-Alt-4" />
        </MenuAction>
        <MenuAction action={onLevel(5)} selected={level === 5} title="Heading 5">
          <Keyboard shortcut="Mod-Alt-5" />
        </MenuAction>
        <MenuAction action={onLevel(6)} selected={level === 6} title="Heading 6">
          <Keyboard shortcut="Mod-Alt-6" />
        </MenuAction>
      </Menu>
      <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />
    </Grid>
  );
}

export default HeadingActions;
