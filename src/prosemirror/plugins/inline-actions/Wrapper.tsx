/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
  Popper, PopperPlacementType, ThemeProvider,
} from '@material-ui/core';
import { EditorView } from 'prosemirror-view';
import Toolbar from './Toolbar';
import { opts, ref } from '../../../connect';
import { SelectionKinds } from './types';


type Props = {
  view: EditorView;
};

type State = {
  open: boolean;
  edit: boolean;
  kind: SelectionKinds | null;
  anchorEl: any;
  placement: PopperPlacementType;
};

class Wrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      kind: null,
      open: false,
      edit: false,
      anchorEl: null,
      placement: 'bottom-start',
    };
  }

  render() {
    const { view } = this.props;
    const {
      open, edit, kind, anchorEl, placement,
    } = this.state;
    return (
      <ThemeProvider theme={opts.theme}>
        <Provider store={ref.store()}>
          <Popper
            style={{ zIndex: 1301 }} // This allows it to be overtop of the asides and modals
            open={open}
            anchorEl={anchorEl}
            transition
            placement={placement}
          >
            <Toolbar {...{
              view, open, edit, kind,
            }}
            />
          </Popper>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default Wrapper;
