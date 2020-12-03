/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { DEFAULT_IMAGE_WIDTH } from '@iooxa/schema';
import ImageToolbar, { AlignOptions } from './ImageToolbar';
import { opts } from '../../../connect';


type Props = {
  onAlign: (align: AlignOptions) => void;
  onWidth: (width: number) => void;
  onDelete: () => void;
};

type State = {
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
      open, edit, src, alt, title, align, width,
    } = this.state;
    return (
      <ThemeProvider theme={opts.theme}>
        <div style={{ textAlign: align, margin: '1.5em 0' }}>
          <img src={src} alt={alt} title={title} width={`${width}%`} style={{ outline: open ? '2px solid #8cf' : 'none' }} />
          <ImageToolbar
            open={open && edit}
            align={align}
            width={width}
            {...{ onAlign, onWidth, onDelete }}
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default ImageEditor;
