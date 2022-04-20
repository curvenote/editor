import React from 'react';
import { Box } from '@material-ui/core';
import { NodeViewProps } from './types';
import createNodeView from './NodeView';

function LinkBlock({ node }: NodeViewProps) {
  const { title, url, description } = node.attrs;
  return (
    <Box display="flex" flexDirection="column">
      <Box border="1px solid grey">{url}</Box>
      <Box border="1px solid grey">{title}</Box>
      <Box border="1px solid grey">{description}</Box>
    </Box>
  );
}

export const createLinkBlockView = createNodeView(LinkBlock, {
  wrapper: 'div',
  enableSelectionHighlight: true,
});
