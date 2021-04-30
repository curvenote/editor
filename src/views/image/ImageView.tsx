import React, { Component } from 'react';
import { DEFAULT_IMAGE_WIDTH } from '@curvenote/schema';
import { NodeViewProps } from '../types';
import DivToolbar from '../DivToolbar';
import {
  setNodeViewAlign, setNodeViewDelete, setNodeViewWidth,
} from '../../store/actions';
import { AlignOptions } from '../../types';


type State = {
  open: boolean;
  edit: boolean;
  src: string;
  alt: string;
  title: string;
  width: number;
  align: AlignOptions;
};

class ImageEditor extends Component<NodeViewProps, State> {
  constructor(props: NodeViewProps) {
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
    const { view, node, getPos } = this.props;
    const {
      open, edit, src, alt, title, align, width,
    } = this.state;

    const onAlign = setNodeViewAlign(node, view, getPos);
    const onWidth = setNodeViewWidth(node, view, getPos);
    const onDelete = setNodeViewDelete(node, view, getPos);

    return (
      <div style={{ textAlign: align, margin: '1.5em 0' }}>
        {!src?.startsWith('block:') && (
          <img src={src} alt={alt} title={title} width={`${width}%`} style={{ outline: open ? '2px solid #8cf' : 'none' }} />
        )}
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

export default ImageEditor;
