/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { isEditable } from '../prosemirror/plugins/editable';
import { opts, ref } from '../connect';
import { NodeViewProps } from './types';
// import { NodeViewProps } from './types';

export type Options = {
  wrapper: 'span' | 'div';
  className?: string;
};

export type ClassWrapperProps = {
  node: Node;
  view: EditorView;
  getPos: (() => number);
  Child: React.FunctionComponent<NodeViewProps>;
};

type ClassWrapperState = {
  open: boolean;
  edit: boolean;
};

class ClassWrapper extends Component<ClassWrapperProps, ClassWrapperState> {
  constructor(props: ClassWrapperProps) {
    super(props);
    this.state = {
      open: false,
      edit: false,
    };
  }

  render() {
    const {
      view, node, getPos, Child,
    } = this.props;
    const { open, edit } = this.state;
    return (
      <Child {...{
        view, node, getPos, open, edit,
      }}
      />
    );
  }
}

export class ReactWrapper {
  dom: HTMLElement;

  node: Node;

  view: EditorView;

  editor: null | React.Component = null;

  getPos: (() => number);

  constructor(
    NodeView: React.FunctionComponent<NodeViewProps>,
    nodeViewPos: Omit<ClassWrapperProps, 'Child'>,
    options: Options,
  ) {
    const { node, view, getPos } = nodeViewPos;
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.dom = document.createElement(options.wrapper);
    if (options.className) this.dom.classList.add(options.className);

    render(
      <ThemeProvider theme={opts.theme}>
        <Provider store={ref.store()}>
          <ClassWrapper
            {...{
              node, view, getPos, Child: NodeView,
            }}
            ref={(r) => { this.editor = r; }}
          />
        </Provider>
      </ThemeProvider>,
      this.dom,
      async () => {
        this.editor?.setState({ ...node.attrs });
      },
    );
  }

  selectNode() {
    const edit = isEditable(this.view.state);
    this.editor?.setState({ open: this.view.hasFocus(), edit });
  }

  deselectNode() {
    const edit = isEditable(this.view.state);
    this.editor?.setState({ open: false, edit });
  }

  update(node: Node) { // TODO: this has decorations in the args!
    if (!node.sameMarkup(this.node)) return false;
    this.node = node;
    const edit = isEditable(this.view.state);
    this.editor?.setState({ edit, ...node.attrs });
    return true;
  }
}

function createNodeView(
  Editor: React.FunctionComponent<NodeViewProps>,
  options: Options = { wrapper: 'div' },
) {
  return (node: Node, view: EditorView, getPos: boolean | (() => number)) => (
    new ReactWrapper(Editor, { node, view, getPos: getPos as (() => number) }, options)
  );
}

export default createNodeView;
