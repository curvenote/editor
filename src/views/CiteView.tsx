import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { useCitation } from '../components/Citation';
import { State } from '../store/types';
import { getEditorUI } from '../store/selectors';
import createNodeView from './NodeView';


type Props = {
  view: EditorView;
  node: Node;
  open: boolean;
  edit: boolean;
};

const CiteInline = (props: Props) => {
  const {
    view, node, open, edit,
  } = props;
  const uid = node.attrs.key;
  const {
    loading, inline, json, error,
  } = useCitation(uid);

  const selected = useSelector((state: State) => getEditorUI(state).viewId === view.dom.id);

  const filler = loading ? 'Loading Citation, 0000' : 'Citation Not Found';

  return (
    <span
      className={classNames({ 'ProseMirror-selectednode': selected && open && edit, error: !loading && error })}
      title={json?.title ?? ''}
      key={uid}
    >
      {inline || filler}
    </span>
  );
};

const CiteView = createNodeView(
  CiteInline,
  { wrapper: 'span', className: 'citation' },
);

export default CiteView;
