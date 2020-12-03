import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import LinkToolbar from './LinkToolbar';
import { opts, ref } from '../../../connect';


type Props = {
};

type State = {
  viewId: string;
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
      viewId: '',
      open: false,
      edit: false,
      href: '',
      onEdit: null,
      onDelete: null,
    };
  }

  render() {
    const {
      viewId, open, edit, href,
      onEdit, onDelete,
    } = this.state;
    return (
      <ThemeProvider theme={opts.theme}>
        <Provider store={ref.store()}>
          <LinkToolbar
            {...{
              viewId, open, edit, href, onDelete, onEdit,
            }}
          />
        </Provider>
      </ThemeProvider>
    );
  }
}

export default LinkEditor;
