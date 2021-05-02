import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import { opts } from '../connect';
import { CitationFormat } from '../types';
import MenuIcon from './Menu/Icon';

const useStyles = makeStyles(() => createStyles({
  root: {
  },
}));

export const useCitation = (uid: string) => {
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState<CitationFormat | null>(null);
  const noJson = json == null;
  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    opts.citationKeyToJson(uid).then((data) => {
      setJson(data);
      setLoading(false);
    });
  }, [uid]);

  let inline = null;
  if (json) {
    const author1 = json.authors?.[0]?.split(',')?.[0] ?? 'Unknown';
    const author2 = json.authors?.[1]?.split(',')?.[0] ?? 'Unknown';
    const year = json.date?.getUTCFullYear();
    switch (json.authors?.length) {
      case 1:
        inline = `${author1}, ${year}`;
        break;
      case 2:
        inline = `${author1} & ${author2}, ${year}`;
        break;
      default:
        inline = `${author1} et al., ${year}`;
    }
  }

  return {
    loading,
    json,
    inline,
    error: noJson,
  };
};


type Props = {
  uid: string;
};

const Citation = (props: Props) => {
  const { uid } = props;

  const classes = useStyles();
  const { json } = useCitation(uid);

  const openUrl = () => window.open(json?.url, '_blank');

  return (
    <div className={classes.root}>
      {json?.url && <div style={{ float: 'right' }}><MenuIcon kind="open" onClick={openUrl} /></div>}
      <Typography variant="subtitle1">{json?.title}</Typography>
      <Typography variant="subtitle2">{json?.authors.join(', ')}</Typography>
    </div>
  );
};

export default Citation;
