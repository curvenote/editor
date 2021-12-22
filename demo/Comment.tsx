import { makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/styles';
import React from 'react';
import { useDispatch } from 'react-redux';
import { v4 } from 'uuid';
import { actions, Editor } from '../src';

interface CommentProps {
  value: string;
  onChange: (content: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .CodeMirror': {
        margin: 0,
      },
      '& ul': {
        margin: 0,
      },
      '& p': {
        marginTop: 0,
        marginBottom: 0,
        ...theme.typography.subtitle2,
      },
    },
  }),
);

export default function Comment({ value, onChange }: CommentProps) {
  const classes = useStyles();
  const [identity, updateIdentity] = React.useState<
    { stateKey: string; viewKey: string; docKey: string } | undefined
  >(undefined);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const id = v4();
    const stateKey = `statekey-${id}`;
    const viewKey = `viewkey-${id}`;
    const docKey = `dockey-${id}`;
    updateIdentity({
      stateKey,
      viewKey,
      docKey,
    });
    dispatch(actions.initEditorState('comment', stateKey, true, '', 0));
  }, []);

  return (
    <div className={classes.root}>
      {identity ? <Editor stateKey={identity.stateKey} viewId={identity.viewKey} /> : null}
    </div>
  );
}
