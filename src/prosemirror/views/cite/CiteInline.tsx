import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useCitation } from '../../../components/Citation';
import { State } from '../../../store/types';
import { getEditorUI } from '../../../store/selectors';


type Props = {
  viewId: string;
  open: boolean;
  uid: string;
};

const CiteInline = (props: Props) => {
  const { viewId, open, uid } = props;
  const { inline, json, error } = useCitation(uid);

  const selectedId = useSelector((state: State) => getEditorUI(state).viewId);
  const selected = selectedId === viewId;

  return (
    <span
      className={classNames({ 'ProseMirror-selectednode': open && selected, error })}
      title={json?.title ?? ''}
      key={uid}
    >
      {inline || 'Citation Not Found'}
    </span>
  );
};

export default CiteInline;
