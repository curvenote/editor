import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { useDispatch, useSelector } from 'react-redux';
import { types } from '@curvenote/schema';
import MenuIcon from '../Menu/Icon';
import { deleteNode, updateNodeAttrs } from '../../store/actions';
import SelectWidth from './SelectWidth';
import TextAction from './TextAction';
import { ActionProps, positionPopper } from './utils';
import { Dispatch, State } from '../../store';
import { getEditorState } from '../../store/selectors';
import { createId } from '../../utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'fit-content',
      fontSize: 20,
      flexWrap: 'nowrap',
    },
  }),
);

type Props = ActionProps & {
  showCaption?: boolean;
};

const AlignActions = (props: Props) => {
  const { stateId, viewId, anchorEl, showCaption } = props;
  const dispatch = useDispatch<Dispatch>();
  const classes = useStyles();
  const [labelOpen, setLabelOpen] = useState(false);
  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  const { node, from: pos } = (selection as NodeSelection) ?? {};
  // If the node changes, set open label to false
  useEffect(() => setLabelOpen(false), [node]);
  if (!node || !selection || !isNodeSelection(selection)) return null;
  const { align, width, numbered, caption, label } = node?.attrs;

  const onAlign = (a: types.AlignOptions) => () => {
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { align: a }));
  };
  const onWidth = (value: number) => {
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { width: value }));
  };
  const onNumbered = () =>
    dispatch(
      updateNodeAttrs(
        stateId,
        viewId,
        { node, pos },
        label === '' ? { numbered: !numbered, label: createId('fig') } : { numbered: !numbered },
      ),
    );
  const onCaption = () =>
    dispatch(
      updateNodeAttrs(
        stateId,
        viewId,
        { node, pos },
        label === '' && !caption
          ? { caption: !caption, label: createId('fig') }
          : { caption: !caption },
      ),
    );
  const onLabel = (t: string) =>
    dispatch(
      updateNodeAttrs(
        stateId,
        viewId,
        { node, pos },
        t === '' ? { label: createId('fig') } : { label: t },
      ),
    );
  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));

  const validateId = async (t: string) => {
    if (t === '') return true;
    const r = /^([a-zA-Z][a-zA-Z0-9-]*[a-zA-Z0-9])$/;
    return r.test(t);
  };

  positionPopper(anchorEl);

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
      <MenuIcon kind="left" active={align === 'left'} onClick={onAlign('left')} />
      <MenuIcon kind="center" active={align === 'center'} onClick={onAlign('center')} />
      <MenuIcon kind="right" active={align === 'right'} onClick={onAlign('right')} />
      <MenuIcon kind="divider" />
      <SelectWidth width={width} onWidth={onWidth} />
      {showCaption && (
        <>
          <MenuIcon kind="divider" />
          <MenuIcon kind="caption" active={caption} onClick={onCaption} />
          {caption && (
            <>
              <MenuIcon kind="label" active={Boolean(label)} onClick={() => setLabelOpen(true)} />
              <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />
            </>
          )}
        </>
      )}
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

AlignActions.defaultProps = {
  showCaption: false,
};

export default AlignActions;
