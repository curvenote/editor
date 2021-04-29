import React, { Component } from 'react';
import { DEFAULT_IMAGE_WIDTH } from '@curvenote/schema';
import { NodeViewProps } from './types';
import DivToolbar from './DivToolbar';
import {
  setNodeViewAlign, setNodeViewDelete, setNodeViewWidth,
} from '../../store/actions';
import { AlignOptions } from '../../types';


type State = {
  open: boolean;
  edit: boolean;
  src: string;
  width: number;
  align: AlignOptions;
};

class IFrameView extends Component<NodeViewProps, State> {
  constructor(props: NodeViewProps) {
    super(props);
    this.state = {
      open: false,
      edit: false,
      src: '',
      align: 'center',
      width: DEFAULT_IMAGE_WIDTH,
    };
  }

  render() {
    const { node, view, getPos } = this.props;
    const {
      open, edit, src, align, width,
    } = this.state;

    const onAlign = setNodeViewAlign(node, view, getPos);
    const onWidth = setNodeViewWidth(node, view, getPos);
    const onDelete = setNodeViewDelete(node, view, getPos);

    return (
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
        <DivToolbar
          open={open && edit}
          {...{
            viewId: view.dom.id, align, width, onAlign, onWidth, onDelete,
          }}
        />
      </div>
    );
  }
}

export default IFrameView;
