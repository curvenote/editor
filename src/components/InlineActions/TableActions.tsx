import React, { useCallback } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { findChildrenByType, findParentNode } from 'prosemirror-utils';
import { Fragment, Node, NodeType } from 'prosemirror-model';
import { CaptionKind, nodeNames, Nodes } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, deleteNode, updateNodeAttrs } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import { actions, Dispatch, State } from '../../store';
import { ActionProps, positionPopper } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';
import { CommandNames } from '../../store/suggestion/commands';
import { createFigureCaption } from './FigureActions';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'fit-content',
      fontSize: 20,
      flexWrap: 'nowrap',
    },
    popover: {
      overflow: 'visible',
    },
  }),
);

const TableActions: React.FC<ActionProps> = (props) => {
  const { stateId, viewId } = props;
  const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();

  const editorState = useSelector((state: State) => getEditorState(state, stateId)?.state);
  const selection = editorState?.selection;
  const figure =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.figure)(selection);
  const figcaption =
    editorState && figure
      ? findChildrenByType(figure?.node, editorState?.schema.nodes[nodeNames.figcaption])[0]
      : undefined;
  const parent =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.table)(selection);
  const node = parent?.node ?? getNodeFromSelection(selection);
  const pos = parent?.pos ?? selection?.from;

  const command = useCallback(
    (name: CommandNames) => dispatch(actions.executeCommand(name, viewId)),
    [stateId, viewId],
  );
  if (!editorState || !node || pos == null) return null;
  positionPopper();

  if (figcaption && figure) figcaption.pos = figure.pos + 1 + figcaption.pos;

  const onDelete = () => dispatch(deleteNode(stateId, viewId, figure ?? { node, pos }));
  const onCaption = () => {
    if (!figure) {
      // Create the figure and the figcaption
      const Figure = editorState.schema.nodes[nodeNames.figure] as NodeType;
      const caption = createFigureCaption(editorState.schema, CaptionKind.table);
      const wrapped = Figure.createAndFill({}, Fragment.fromArray([caption, node])) as Node;
      const tr = editorState.tr
        .setSelection(NodeSelection.create(editorState.doc, pos))
        .replaceSelectionWith(wrapped);
      const selected = tr.setSelection(TextSelection.create(tr.doc, pos + 2));
      dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
      return;
    }
    if (figcaption) {
      // Remove the caption
      const tr = editorState.tr
        .setSelection(NodeSelection.create(editorState.doc, figcaption.pos))
        .deleteSelection();
      dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
    } else {
      // Insert a table caption at the top of the figure
      const caption = createFigureCaption(editorState.schema, CaptionKind.table);
      const tr = editorState.tr.insert(figure.pos + 1, caption);
      const selected = tr.setSelection(TextSelection.create(tr.doc, figure.pos + 2));
      dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
    }
  };
  const numbered = (figcaption?.node.attrs as Nodes.Figcaption.Attrs)?.numbered ?? false;
  const onNumbered = () => {
    if (!figcaption) return;
    dispatch(updateNodeAttrs(stateId, viewId, figcaption, { numbered: !numbered }, 'inside'));
  };

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <MenuIcon kind="rowAbove" onClick={() => command(CommandNames.add_row_before)} />
      <MenuIcon kind="rowBelow" onClick={() => command(CommandNames.add_row_after)} />
      <MenuIcon kind="colLeft" onClick={() => command(CommandNames.add_column_before)} />
      <MenuIcon kind="colRight" onClick={() => command(CommandNames.add_column_after)} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="rowDelete" onClick={() => command(CommandNames.delete_row)} dangerous />
      <MenuIcon kind="colDelete" onClick={() => command(CommandNames.delete_column)} dangerous />
      <MenuIcon kind="divider" />
      <MenuIcon kind="caption" active={Boolean(figcaption)} onClick={onCaption} />
      {figcaption && <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />}
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default TableActions;
