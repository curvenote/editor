import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles, createStyles, Grid, Menu } from '@material-ui/core';
import { Node } from 'prosemirror-model';
import { schemas } from '@curvenote/schema';
import { findParentNode } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { updateNodeAttrs, wrapInHeading } from '../../store/actions';
import TextAction from './TextAction';
import { getEditorState } from '../../store/selectors';
import { Dispatch, State } from '../../store';
import { ActionProps, positionPopper } from './utils';
import MenuAction from '../Menu/Action';
import Keyboard from '../Keyboard';

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

const HeadingActions = (props: ActionProps) => {
  const { stateId, viewId } = props;
  const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();
  const [labelOpen, setLabelOpen] = useState(false);
  const state = useSelector((s: State) => getEditorState(s, stateId)?.state);
  const parent =
    state?.selection &&
    findParentNode((n: Node) => n.type.name === schemas.nodeNames.heading)(state?.selection);
  const node = parent?.node ?? (state?.selection as NodeSelection).node;
  const pos = parent?.pos ?? state?.selection?.from;
  useEffect(() => setLabelOpen(false), [node]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onOpen = useCallback(
    (event: React.MouseEvent<any>) => setAnchorEl(event.currentTarget),
    [],
  );
  const onClose = useCallback(() => setAnchorEl(null), []);

  if (!node || pos == null) return null;
  // If the node changes, set open label to false
  const { numbered, label, level } = node.attrs;

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
  const onLabel = (t: string) =>
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { label: t }, false));

  const validateId = async (t: string) => {
    if (t === '') return true;
    const r = /^([a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9])$/;
    return r.test(t);
  };

  // Reposition the popper
  positionPopper();

  if (labelOpen) {
    return (
      <TextAction
        text={label}
        onCancel={() => setLabelOpen(false)}
        onSubmit={(t) => {
          onLabel(t);
          setLabelOpen(false);
        }}
        validate={validateId}
        help="The ID must be at least two characters and start with a letter, it may have dashes inside."
      />
    );
  }

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
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
      <MenuIcon kind="label" active={Boolean(label)} onClick={() => setLabelOpen(true)} />
      <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />
    </Grid>
  );
};

export default HeadingActions;
