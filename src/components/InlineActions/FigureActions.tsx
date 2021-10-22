import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { Fragment, Node, Schema } from 'prosemirror-model';
import { findChildrenByType, findParentNode } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import { nodeNames, Nodes, types, CaptionKind } from '@curvenote/schema';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, deleteNode, updateNodeAttrs } from '../../store/actions';
import SelectWidth from './SelectWidth';
import { ActionProps, positionPopper } from './utils';
import { AppThunk, Dispatch, State } from '../../store';
import { getEditorState } from '../../store/selectors';
import { getNodeFromSelection } from '../../store/ui/utils';
import { createId, opts } from '../..';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'fit-content',
      fontSize: 20,
      flexWrap: 'nowrap',
    },
  }),
);

type Props = ActionProps;

export function createFigureCaption(schema: Schema, kind: CaptionKind, src?: string) {
  const FigcaptionNode = schema.nodes[nodeNames.figcaption];
  const fragment = src ? opts.getCaptionFragment(schema, src) : Fragment.empty;
  const captionAttrs: Nodes.Figcaption.Attrs = {
    kind,
    id: createId(),
    label: null,
    numbered: true,
  };
  const caption = FigcaptionNode.create(captionAttrs, fragment);
  return caption;
}

function toggleCaption(stateId: any, viewId: string | null, figurePos: number): AppThunk {
  return (dispatch, getState) => {
    const editorState = getEditorState(getState(), stateId)?.state;
    if (!editorState) return;
    const pos = editorState.doc.resolve(figurePos);
    const figure = pos.nodeAfter;
    if (!figure || figure.type.name !== nodeNames.figure) return;
    const FigcaptionNode = editorState.schema.nodes[nodeNames.figcaption];
    const figcaption = findChildrenByType(figure, FigcaptionNode)[0]; // This might be undefined
    // TODO: this should be image or code or table
    const image = findChildrenByType(figure, editorState.schema.nodes[nodeNames.image])[0];
    // The inside of a non-leaf node is always node.pos + 1
    const start = figurePos + 1;
    if (figcaption) {
      // Delete figure caption
      if (figure.childCount === 1) {
        // If there is only a figure caption, delete the entire node
        const nodeSelection = NodeSelection.create(editorState.doc, figurePos);
        const tr = editorState.tr.setSelection(nodeSelection).deleteSelection();
        dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
        return;
      }
      const nodeSelection = NodeSelection.create(editorState.doc, start + figcaption.pos);
      const tr = editorState.tr.setSelection(nodeSelection).deleteSelection();
      let selected = tr;
      if (image) {
        selected = tr
          .setSelection(NodeSelection.create(tr.doc, start + image.pos))
          .scrollIntoView();
      }
      dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
    } else {
      const newcaption = createFigureCaption(
        editorState.schema,
        CaptionKind.fig,
        image.node.attrs.src,
      );
      const insertion = start + image.pos + image.node.nodeSize;
      const tr = editorState.tr.insert(insertion, newcaption);
      const captionstart = insertion + 1;
      const captionend = captionstart + newcaption.nodeSize - 2;
      // Select the new caption text
      const selected = tr
        .setSelection(TextSelection.create(tr.doc, captionstart, captionend))
        .scrollIntoView();
      dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
    }
  };
}

const FigureImageActions: React.FC<Props> = (props) => {
  const { stateId, viewId } = props;
  const dispatch = useDispatch<Dispatch>();
  const classes = useStyles();
  const editorState = useSelector((state: State) => getEditorState(state, stateId)?.state);
  const selection = editorState?.selection;
  const parent =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.figure)(selection);
  const figure = parent?.node ?? getNodeFromSelection(selection); // My parent, or directly selecting the node
  const pos = parent?.pos ?? selection?.from;
  if (!editorState || !figure || pos == null) return null;
  const { align } = figure?.attrs as Nodes.Figure.Attrs;
  const image = findChildrenByType(figure, editorState.schema.nodes[nodeNames.image])[0];
  const FigcaptionNode = editorState.schema.nodes[nodeNames.figcaption];
  const figcaption = findChildrenByType(figure, FigcaptionNode)[0]; // Note: this may be undefined!!

  const onAlign = (a: types.AlignOptions) => () => {
    dispatch(updateNodeAttrs(stateId, viewId, { node: figure, pos }, { align: a }));
  };
  if (image) image.pos = pos + 1 + image.pos;
  if (figcaption) figcaption.pos = pos + 1 + figcaption.pos;
  const width = (image?.node.attrs as Nodes.Image.Attrs)?.width ?? null;
  const numbered = (figcaption?.node.attrs as Nodes.Figcaption.Attrs)?.numbered ?? false;
  const onWidth = (value: number) => {
    if (!image) return;
    dispatch(updateNodeAttrs(stateId, viewId, image, { width: value }));
    positionPopper();
  };
  const onNumbered = () =>
    dispatch(updateNodeAttrs(stateId, viewId, figcaption, { numbered: !numbered }, 'inside'));
  const onCaption = () => {
    dispatch(toggleCaption(stateId, viewId, pos));
    positionPopper();
  };

  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node: figure, pos }));

  positionPopper();

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <MenuIcon kind="left" active={align === 'left'} onClick={onAlign('left')} />
      <MenuIcon kind="center" active={align === 'center'} onClick={onAlign('center')} />
      <MenuIcon kind="right" active={align === 'right'} onClick={onAlign('right')} />
      <MenuIcon kind="divider" />
      {image && (
        <>
          <SelectWidth width={width} onWidth={onWidth} />
          <MenuIcon kind="divider" />
        </>
      )}
      <MenuIcon kind="caption" active={Boolean(figcaption)} onClick={onCaption} />
      {figcaption && <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />}
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default FigureImageActions;
