import React from 'react';
import type { Node } from 'prosemirror-model';
import { render } from 'react-dom';
import type { NodeView, EditorView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import type { GetPos } from './types';
import { TextSelection } from 'prosemirror-state';
import { nodeNames } from '@curvenote/schema';
import classNames from 'classnames';
import { v4 } from 'uuid';
import { ref } from '../connect';
import { Provider } from 'react-redux';

function addBlock(view: EditorView, node: Node, getPos: GetPos, before: boolean) {
  const blockPos = getPos();
  const { state, dispatch } = view;
  const blockNode = state.schema.nodes[nodeNames.block];
  // create a new node before pos
  const paragraph = state.schema.nodes.paragraph.createAndFill({}) as Node;
  const newNode = blockNode.createAndFill({ id: v4() }, [paragraph]) as Node;

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

function Menu() {
  return <div>Menu</div>;
}

type Props = {
  view: EditorView;
  node: Node;
  getPos: GetPos;
  selected?: boolean;
};

function FancyControl({ view, node, getPos, selected }: Props) {
  console.log('selected', selected);
  return (
    <div
      className={classNames('block-controls', {
        'selected-block-control': selected,
      })}
    >
      <button
        onClick={() => {
          addBlock(view, node, getPos, true);
        }}
      >
        +
      </button>
      <Menu />
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

function FancyBlockControls({ view, node, getPos, selected }: Props) {
  return (
    <Provider store={ref.store()}>
      <FancyControl view={view} node={node} getPos={getPos} selected={selected} />
    </Provider>
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

  getPos: GetPos;

  constructor(node: Node, view: EditorView, getPos: GetPos) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement('div');
    this.dom.setAttribute('id', node.attrs.id);
    this.state = { selected: false }; // let's treat this immutably shall we

    const blockControls = document.createElement('div');
    this.blockControls = blockControls;
    blockControls.setAttribute('contenteditable', 'false');
    render(<FancyBlockControls view={view} node={node} getPos={getPos} />, this.blockControls);
    this.dom.appendChild(blockControls);

    const contentContainer = document.createElement('div');
    this.dom.appendChild(contentContainer);

    this.dom.classList.add('block-node-view');
    this.contentDOM = contentContainer; // tells prosemirror to render children here
  }

  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
    render(
      <FancyBlockControls view={this.view} node={this.node} getPos={this.getPos} />,
      this.blockControls,
    );
  }

  update(node: Node, decorations: readonly any[]) {
    console.log('node view update', node, decorations);
    if (!this.view || !this.getPos) return false;
    if (decorations.length === 0) {
      render(
        <FancyBlockControls view={this.view} node={node} getPos={this.getPos} />,
        this.blockControls,
      );
      return true;
    }

    const selected = !!decorations.find((deco) => {
      console.log('deco', deco);
      return deco.type.attrs.selected === 'true';
    });
    console.log('selected', decorations[0]?.type.attrs.selected);

    render(
      <FancyBlockControls view={this.view} node={node} getPos={this.getPos} selected={selected} />,
      this.blockControls,
    );
    return true;
  }

  selectNode() {
    if (!isEditable(this.view.state) || !this.getPos) return;
    this.dom.classList.add('ProseMirror-selectednode');
    render(
      <FancyBlockControls view={this.view} node={this.node} getPos={this.getPos} selected />,
      this.blockControls,
    );
  }
}

export function createTopBlockView(node: Node, view: EditorView, getPos: GetPos) {
  return new BlockNodeView(node, view, getPos);
}
