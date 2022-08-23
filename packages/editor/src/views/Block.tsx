import React, { useEffect } from 'react';
import type { Node } from 'prosemirror-model';
import { render } from 'react-dom';
import type { NodeView, EditorView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import type { GetPos } from './types';
import { TextSelection } from 'prosemirror-state';
import { createStyles, makeStyles } from '@material-ui/core';
import { nodeNames } from '@curvenote/schema';
import classNames from 'classnames';

function addBlock(view: EditorView, node: Node, getPos: GetPos, before: boolean) {
  const blockPos = getPos();
  const { state, dispatch } = view;
  const blockNode = state.schema.nodes[nodeNames.block];
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
      display: 'none',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: -15,
      cursor: 'all-scroll',
      backgroundColor: 'black',
      color: 'white',
    },
  }),
);

function FancyBlockControls({
  view,
  node,
  getPos,
  selected,
}: {
  view: EditorView;
  node: Node;
  getPos: GetPos;
  selected?: boolean;
}) {
  const classes = useStyles();
  console.log('render', selected);
  return (
    <div
      className={classNames(classes.root, 'block-controls', { 'selected-block-control': selected })}
    >
      <button
        onClick={() => {
          addBlock(view, node, getPos, true);
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          addBlock(view, node, getPos, false);
        }}
      >
        +
      </button>
    </div>
  );
}

class BlockNodeView implements NodeView {
  // The node's representation in the editor (empty, for now)
  dom: HTMLDivElement;
  contentDOM: HTMLDivElement;
  blockControls: HTMLDivElement;
  state: { selected: boolean };

  node: Node;

  view: EditorView;

  getPos?: GetPos;

  constructor(node: Node, view: EditorView, getPos: GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');
    this.state = { selected: false }; // let's treat this immutably shall we

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

  deselectNode() {
    if (!this.getPos) return;
    this.dom.classList.remove('ProseMirror-selectednode');
    this.state = { selected: false };
    render(
      <FancyBlockControls
        view={this.view}
        node={this.node}
        getPos={this.getPos}
        selected={this.state.selected}
      />,
      this.blockControls,
    );
  }

  update(node: Node) {
    if (!this.view || !this.getPos) return false;
    render(
      <FancyBlockControls view={this.view} node={node} getPos={this.getPos} />,
      this.blockControls,
    );
    return true;
  }
  selectNode() {
    console.log('selectNode', this.getPos);
    if (!isEditable(this.view.state) || !this.getPos) return;
    this.dom.classList.add('ProseMirror-selectednode');
    this.state = { selected: true };
    render(
      <FancyBlockControls
        view={this.view}
        node={this.node}
        getPos={this.getPos}
        selected={this.state.selected}
      />,
      this.blockControls,
    );
  }
}

export function createTopBlockView(node: Node, view: EditorView, getPos: GetPos) {
  return new BlockNodeView(node, view, getPos);
}
