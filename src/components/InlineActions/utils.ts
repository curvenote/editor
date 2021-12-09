import { nodeNames } from '@curvenote/schema';
import { findParentNode, findChildrenByType } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { PopperProps } from '@material-ui/core';

export type ActionProps = {
  stateId: any;
  viewId: string | null;
};

let popper: { update: () => void } | null = null;

export function registerPopper(next: typeof popper) {
  popper = next;
}

export function positionPopper() {
  popper?.update();
}

export function getFigure(editorState: EditorState | null) {
  if (!editorState) {
    return { figure: undefined, figcaption: undefined };
  }
  const { selection } = editorState;
  const figure =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.figure)(selection);
  const figcaption = figure
    ? findChildrenByType(figure?.node, editorState.schema.nodes[nodeNames.figcaption])[0]
    : undefined;

  return { figure, figcaption };
}

type NodeOrNodeFunction = (() => Element | null) | Element | null;

export function createPopperLocationCache() {
  const cache = {
    node: null as NodeOrNodeFunction,
    clientRect: null as DOMRect | null,
    clientWidth: 0,
    clientHeight: 0,
  };

  function setNode(nodeOrFunction: NodeOrNodeFunction) {
    const node = typeof nodeOrFunction === 'function' ? nodeOrFunction() : nodeOrFunction;
    cache.node = nodeOrFunction;
    if (node && node.isConnected) {
      cache.clientRect = node.getBoundingClientRect();
      cache.clientWidth = node.clientWidth ?? 0;
      cache.clientHeight = node.clientHeight ?? 0;
    }
  }
  function getNode() {
    const node = typeof cache.node === 'function' ? cache.node() : cache.node;
    return node;
  }

  const anchorEl: PopperProps['anchorEl'] = {
    getBoundingClientRect() {
      setNode(cache.node);
      return cache.clientRect as DOMRect;
    },
    get clientWidth() {
      setNode(cache.node);
      return cache.clientWidth;
    },
    get clientHeight() {
      setNode(cache.node);
      return cache.clientHeight;
    },
  };

  return {
    setNode,
    getNode,
    anchorEl,
  };
}
