/// <reference types="prosemirror-model" />
import MathView from './MathView';
import ImageView from './ImageView';
import IFrameView from './IFrameView';
import LinkView from './LinkView';
import CiteView from './CiteView';
import TimeView from './TimeView';
import createNodeView from './NodeView';
import WidgetView from './WidgetView';
export type { NodeViewProps } from './types';
declare const _default: {
    createNodeView: typeof createNodeView;
    MathView: typeof MathView;
    ImageView: typeof ImageView;
    IFrameView: typeof IFrameView;
    LinkView: typeof LinkView;
    TimeView: typeof TimeView;
    CiteView: typeof CiteView;
    WidgetView: typeof WidgetView;
    newWidgetView: (node: import("prosemirror-model").Node<any>, view: import("prosemirror-view").EditorView<any>, getPos: boolean | (() => number)) => WidgetView;
};
export default _default;
