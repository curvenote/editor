import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { opts, ref } from '../../../connect';
import CiteInline from './CiteInline';


type Props = {
  onDelete: () => void;
};

type State = {
  viewId: string;
  open: boolean;
  edit: boolean;
  uid: string;
};

class CiteEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      viewId: '',
      open: false,
      edit: false,
      uid: '',
    };
  }

  render() {
    const { onDelete } = this.props;
    const {
      viewId, open, edit, uid,
    } = this.state;
    return (
      <ThemeProvider theme={opts.theme}>
        <Provider store={ref.store()}>
          <CiteInline {...{ viewId, open, uid }} />
        </Provider>
      </ThemeProvider>
    );
  }
}

export default CiteEditor;
