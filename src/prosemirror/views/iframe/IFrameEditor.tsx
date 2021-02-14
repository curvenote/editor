import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';
import { DEFAULT_IMAGE_WIDTH } from '@curvenote/schema';
import ImageToolbar, { AlignOptions } from './IFrameToolbar';
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
  width: number;
  align: AlignOptions;
};

class IFrameEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      viewId: '',
      open: false,
      edit: false,
      src: '',
      align: 'center',
      width: DEFAULT_IMAGE_WIDTH,
    };
  }

  render() {
    const { onAlign, onWidth, onDelete } = this.props;
    const {
      viewId, open, edit, src, align, width,
    } = this.state;
    return (
      <ThemeProvider theme={opts.theme}>
        <Provider store={ref.store()}>
          <div style={{ margin: '1.5em 0' }}>
            <div style={{
              position: 'relative',
              paddingBottom: `${Math.round((9 / 16) * width)}%`,
              width: `${width}%`,
              marginLeft: align === 'left' ? '' : 'auto',
              marginRight: align === 'right' ? '' : 'auto',
            }}
            >
              <iframe
                title={src}
                style={{
                  width: '100%', height: '100%', position: 'absolute', left: 0, top: 0,
                }}
                frameBorder="0"
                width="100%"
                height="100%"
                src={src}
                allowFullScreen
                allow="autoplay"
              />
            </div>
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

export default IFrameEditor;
