import React from 'react';
import type { NodeViewProps } from './types';
import createNodeView from './NodeView';

function LinkBlock({ node }: NodeViewProps) {
  const { title, url, description } = node.attrs;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ border: '1px solid grey' }}>{url}</div>
      <div style={{ border: '1px solid grey' }}>{title}</div>
      <div style={{ border: '1px solid grey' }}>{description}</div>
    </div>
  );
}

export const createLinkBlockView = createNodeView(LinkBlock, {
  wrapper: 'div',
  enableSelectionHighlight: true,
});
