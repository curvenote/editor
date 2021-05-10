import React, { useCallback, useState } from 'react';
import {
  makeStyles, createStyles, Grid, Input, CircularProgress,
} from '@material-ui/core';
import MenuIcon from '../../../components/Menu/Icon';

const useStyles = makeStyles(() => createStyles({
  root: {
    width: 'fit-content',
    fontSize: 20,
    flexWrap: 'nowrap',
  },
}));

type Props = {
  text: string;
  help: string;
  validate: (text: string) => Promise<boolean>;
  onSubmit: (text: string) => void;
  onCancel: () => void;
};

const TextAction = (props: Props) => {
  const {
    text: initial, help, validate, onSubmit, onCancel,
  } = props;
  const classes = useStyles();
  const [text, setText] = useState(initial);
  const [current, setCurrent] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);

  const updateText: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const t = e.currentTarget.value;
    setLoading(true);
    setCurrent(t);
    validate(t).then((b) => {
      setLoading(false);
      if (b) {
        setValid(true);
        setText(t);
        return;
      }
      setValid(false);
    });
  }, []);

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <MenuIcon kind="cancel" onClick={onCancel} />
      <Input
        autoFocus
        disableUnderline
        value={current}
        onChange={updateText}
        onKeyDownCapture={(e) => {
          if (e.key === 'Enter') {
            if (!valid || loading) return;
            e.stopPropagation(); e.preventDefault();
            onSubmit(text);
          } else if (e.key === 'Escape') {
            e.stopPropagation(); e.preventDefault();
            onCancel();
          }
        }}
      />
      {loading && <CircularProgress size={18} />}
      <MenuIcon kind="enterSave" title={valid ? 'Save' : help} disabled={loading || !valid} error={!valid} onClick={() => onSubmit(text)} />
    </Grid>
  );
};

export default TextAction;
