import React, { Component } from 'react';
import CiteInline from './CiteInline';
import { NodeViewProps } from '../types';
import createNodeView from '../NodeView';

type State = {
  open: boolean;
  edit: boolean;
};

class CiteViewComponent extends Component<NodeViewProps, State> {
  constructor(props: NodeViewProps) {
    super(props);
    this.state = {
      open: false,
      edit: false,
    };
  }

  render() {
    const { view, node } = this.props;
    const { open, edit } = this.state;
    return (
      <CiteInline {...{
        view, node, open, edit,
      }}
      />
    );
  }
}
const CiteView = createNodeView(
  CiteViewComponent,
  { wrapper: 'span', className: 'citation' },
);

export default CiteView;
