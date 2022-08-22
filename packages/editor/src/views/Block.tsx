import React from 'react';
import type { Node } from 'prosemirror-model';
import { render } from 'react-dom';
import type { NodeView, EditorView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import type { GetPos } from './types';
import { TextSelection } from 'prosemirror-state';
import { createStyles, makeStyles } from '@material-ui/core';
import { BLOCK_NODE_NAME } from '@curvenote/schema';

function addBlock(view: EditorView, node: Node, getPos: GetPos, before: boolean) {
  const blockPos = getPos();
  const { state, dispatch } = view;
  const blockNode = state.schema.nodes[BLOCK_NODE_NAME];
  // create a new node before pos
  const paragraph = state.schema.nodes.paragraph.createAndFill({}) as Node;
  const newNode = blockNode.createAndFill({}, [paragraph]) as Node;

  const tr = before
    ? state.tr.insert(blockPos, newNode)
    : state.tr.insert(blockPos + node.content.size + 1, newNode);

  dispatch(tr);

  if (before) {
    const resolvedPos = view.state.tr.doc.resolve(getPos() - 1);
    view.dispatch(view.state.tr.setSelection(new TextSelection(resolvedPos)));
  } else {
    const resolvedPos = view.state.tr.doc.resolve(getPos() + node.content.size + 3);
    view.dispatch(view.state.tr.setSelection(new TextSelection(resolvedPos)));
  }

  view.focus();
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      cursor: 'all-scroll',
      backgroundColor: 'black',
      padding: '8px',
      color: 'white',
    },
  }),
);

function FancyBlockControls({
  view,
  node,
  getPos,
}: {
  view: EditorView;
  node: Node;
  getPos: GetPos;
}) {
  console.log('rendered', node.content.size);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <button
        onClick={() => {
          addBlock(view, node, getPos, true);
        }}
      >
        Add Block before
      </button>
      <button
        onClick={() => {
          addBlock(view, node, getPos, false);
        }}
      >
        Add Block after
      </button>
    </div>
  );
}

class NewTopBlockNodeView implements NodeView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLDivElement;
  contentDOM: HTMLDivElement;
  blockControls: HTMLDivElement;

  node: Node;

  view: EditorView;

  getPos?: GetPos;

  constructor(node: Node, view: EditorView, getPos: GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');

    const blockControls = document.createElement('div');
    this.blockControls = blockControls;
    blockControls.setAttribute('contenteditable', 'false');
    console.log('consturction??');
    render(<FancyBlockControls view={view} node={node} getPos={getPos} />, this.blockControls);
    this.dom.appendChild(blockControls);

    const contentContainer = document.createElement('div');
    this.dom.appendChild(contentContainer);

    this.dom.classList.add('block-node-view');
    this.contentDOM = contentContainer; // tells prosemirror to render children here
  }

  selectNode() {
    if (!isEditable(this.view.state)) return;
    this.dom.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
  }

  update(node: Node) {
    if (!this.view || !this.getPos) return false;
    render(
      <FancyBlockControls view={this.view} node={node} getPos={this.getPos} />,
      this.blockControls,
    );
    return true;
  }
}

export function createTopBlockView(node: Node, view: EditorView, getPos: GetPos) {
  return new NewTopBlockNodeView(node, view, getPos);
}
