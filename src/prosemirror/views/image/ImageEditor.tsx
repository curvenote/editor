import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { DEFAULT_IMAGE_WIDTH } from '@curvenote/schema';
import ImageToolbar, { AlignOptions } from './ImageToolbar';
import { opts, ref } from '../../../connect';


type Props = {
  onAlign: (align: AlignOptions) => void;
  onWidth: (width: number) => void;
  onDelete: () => void;
};

type State = {
  viewId: string;
  open: boolean;
  edit: boolean;
  src: string;
  alt: string;
  title: string;
  width: number;
  align: AlignOptions;
};

class ImageEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      viewId: '',
      open: false,
      edit: false,
      src: '',
      alt: '',
      title: '',
      align: 'center',
      width: DEFAULT_IMAGE_WIDTH,
    };
  }

  render() {
    const { onAlign, onWidth, onDelete } = this.props;
    const {
      viewId, open, edit, src, alt, title, align, width,
    } = this.state;
    return (
      <ThemeProvider theme={opts.theme}>
        <Provider store={ref.store()}>
          <div style={{ textAlign: align, margin: '1.5em 0' }}>
            {!src?.startsWith('block:') && (
              <img src={src} alt={alt} title={title} width={`${width}%`} style={{ outline: open ? '2px solid #8cf' : 'none' }} />
            )}
            <ImageToolbar
              open={open && edit}
              {...{
                viewId, align, width, onAlign, onWidth, onDelete,
              }}
            />
          </div>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default ImageEditor;
