import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { opts, ref } from '../../../connect';
import PreviewPopup from './PreviewPopup';


type Props = {
};

type State = {
  viewId: string;
  uid: string;
  open: boolean;
  edit: boolean;
};

class PreviewEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      viewId: '',
      uid: '',
      open: false,
      edit: false,
    };
  }

  render() {
    const {
      viewId, open, edit, uid,
    } = this.state;
    return (
      <ThemeProvider theme={opts.theme}>
        <Provider store={ref.store()}>
          <PreviewPopup {...{
            viewId, uid, edit, open,
          }}
          />
        </Provider>
      </ThemeProvider>
    );
  }
}

export default PreviewEditor;
