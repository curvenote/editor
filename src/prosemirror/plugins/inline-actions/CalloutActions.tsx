import React from 'react';
import {
  makeStyles, createStyles, Grid,
} from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import { ContentNodeWithPos, findParentNode } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import MenuIcon from '../../../components/Menu/Icon';
import { liftContentOutOfNode, setNodeViewDelete, setNodeViewKind } from '../../../store/actions';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 'fit-content',
    fontSize: 20,
    flexWrap: 'nowrap',
  },
  popover: {
    overflow: 'visible',
  },
}));

type Props = {
  view: EditorView;
};

const CalloutActions = (props: Props) => {
  const { view } = props;
  const classes = useStyles();
  const { schema } = view.state;

  let p = findParentNode(
    (n) => n.type === schema.nodes.callout,
  )(view.state.selection);

  const { node, from } = view.state.selection as NodeSelection;
  if (node && node.type === schema.nodes.callout) {
    p = { node, pos: from } as ContentNodeWithPos;
  }

  if (!p) return null;

  const onKind = setNodeViewKind(p.node, view, p?.pos as number, false);
  const doKind = (a: string) => () => onKind(a);
  const onDelete = setNodeViewDelete(p.node, view, p?.pos as number);
  const onLift = liftContentOutOfNode(p.node, view, p?.pos as number);

  const { kind } = p.node.attrs;
  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <MenuIcon kind="info" active={kind === 'info'} onClick={doKind('info')} />
      <MenuIcon kind="success" active={kind === 'success'} onClick={doKind('success')} />
      <MenuIcon kind="active" active={kind === 'active'} onClick={doKind('active')} />
      <MenuIcon kind="warning" active={kind === 'warning'} onClick={doKind('warning')} />
      <MenuIcon kind="danger" active={kind === 'danger'} onClick={doKind('danger')} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="lift" onClick={onLift} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </Grid>
  );
};

export default CalloutActions;
