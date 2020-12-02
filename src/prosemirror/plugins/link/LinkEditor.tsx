/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core';
import LinkToolbar from './LinkToolbar';
import { opts } from '../../../connect';


type Props = {
};

type State = {
  open: boolean;
  edit: boolean;
  href: string;
  onEdit: null | (() => void);
  onDelete: null | (() => void);
};

class LinkEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      edit: false,
      href: '',
      onEdit: null,
      onDelete: null,
    };
  }

  render() {
    const {
      open, edit, href,
      onEdit, onDelete,
    } = this.state;
    return (
      <ThemeProvider theme={opts.theme}>
        <LinkToolbar
          {...{ open, edit, href }}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </ThemeProvider>
    );
  }
}

export default LinkEditor;
