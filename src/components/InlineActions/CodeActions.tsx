import React from 'react';
import {
  FormControl,
  Select as MuiSelect,
  MenuItem,
  styled,
  makeStyles,
  createStyles,
  Grid,
} from '@material-ui/core';
import { findParentNode, replaceParentNodeOfType } from 'prosemirror-utils';
import { Node, NodeType } from 'prosemirror-model';
import { CaptionKind, nodeNames, Nodes } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { LanguageNames, SUPPORTED_LANGUAGES } from '../../views/types';
import MenuIcon from '../Menu/Icon';
import {
  applyProsemirrorTransaction,
  createFigure,
  createFigureCaption,
  deleteNode,
} from '../../store/actions';
import { updateNodeAttrs } from '../../store/actions/editor';
import { getEditorState } from '../../store/state/selectors';
import { Dispatch, State } from '../../store';
import { ActionProps, getFigure, positionPopper } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: 'fit-content',
      paddingLeft: '0.5rem',
      fontSize: 20,
      flexWrap: 'nowrap',
    },
    menulist: {
      maxHeight: '15rem',
    },
    dropdownContainer: {
      width: 100,
    },
    popover: {
      overflow: 'visible',
    },
  }),
);

const Select = styled(MuiSelect)(() => ({
  root: {
    zIndex: 1302,
  },
  '& .MuiSelect-select': {
    padding: 2,
  },
}));

function LanguageSeletionDropdown({
  value,
  onChanged,
}: {
  onChanged: (lang: string) => void;
  value: LanguageNames;
}) {
  const classes = useStyles();
  return (
    <FormControl fullWidth>
      <Select
        disableUnderline
        onChange={(e) => {
          onChanged(e.target.value as LanguageNames);
        }}
        value={value || SUPPORTED_LANGUAGES[0].name}
        MenuProps={{
          className: 'above-modals',
          MenuListProps: {
            className: classes.menulist,
          },
        }}
      >
        {SUPPORTED_LANGUAGES.map(({ name, label }) => (
          <MenuItem key={name} value={name}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

const CodeActions: React.FC<ActionProps> = (props) => {
  const { stateId, viewId } = props;
  const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();
  const editorState = useSelector((state: State) => getEditorState(state, stateId)?.state);
  const { figure, figcaption } = getFigure(editorState);
  if (figcaption && figure) figcaption.pos = figure.pos + 1 + figcaption.pos;

  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  const parent =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.code_block)(selection);
  let node: Node;
  let pos: number;
  let end = -1;
  if (parent) {
    node = parent.node;
    pos = parent.pos;
    end = parent.start + parent.node.nodeSize;
  } else {
    node = getNodeFromSelection(selection) as Node;
    if (!node || !selection) {
      return null;
    }
    pos = selection.from;
    end = (selection.$from.start() as number) + node.nodeSize;
  }

  if (!editorState || !node || pos == null) return null;
  positionPopper();

  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));

  const onCaption = () => {
    if (!figure) {
      const wrapped = createFigure(editorState.schema, node, true, { align: 'left' });
      const tr = replaceParentNodeOfType(
        editorState.schema.nodes[nodeNames.code_block] as NodeType,
        wrapped,
      )(editorState.tr);
      dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
      return;
    }
    if (figcaption) {
      // Remove the caption
      const tr = editorState.tr
        .setSelection(NodeSelection.create(editorState.doc, figcaption.pos))
        .deleteSelection();
      dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
    } else {
      const caption = createFigureCaption(editorState.schema, CaptionKind.code);
      const tr = editorState.tr.insert(end - 1, caption);
      const selected = tr.setSelection(TextSelection.create(tr.doc, end));
      dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
    }
  };

  const numbered = (figure?.node.attrs as Nodes.Figure.Attrs)?.numbered ?? false;
  const onNumbered = () => {
    if (!figure || !figcaption) return;
    // TODO: this would be better in one transaction
    dispatch(updateNodeAttrs(stateId, viewId, figure, { numbered: !numbered }));
    dispatch(updateNodeAttrs(stateId, viewId, figcaption, {}, 'inside'));
  };

  return (
    <Grid container alignItems="center" justifyContent="center" className={classes.root}>
      <div className={classes.dropdownContainer}>
        <LanguageSeletionDropdown
          value={node.attrs.language}
          onChanged={(language) => {
            dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { language }, false));
          }}
        />
      </div>
      <MenuIcon
        kind="lineNumbers"
        onClick={() => {
          dispatch(
            updateNodeAttrs(
              stateId,
              viewId,
              { node, pos },
              { linenumbers: !node.attrs.linenumbers },
              false,
            ),
          );
        }}
        active={node.attrs.linenumbers}
      />
      <MenuIcon kind="divider" />

      <MenuIcon kind="caption" active={Boolean(figcaption)} onClick={onCaption} />
      {figcaption && <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />}

      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default CodeActions;
