import MathView, { renderMath } from './MathView';
import ImageView from './ImageView';
import IFrameView from './IFrameView';
import LinkView from './LinkView';
import TimeView from './TimeView';
import createNodeView from './NodeView';
import MentionView from './Mention';
import CodeBlockView from './CodeBlockView';
import FootnoteView from './FootnoteView';
import WidgetView, { newWidgetView } from './WidgetView';
import { clickSelectFigure } from './utils';

export type { NodeViewProps } from './types';

export default {
  createNodeView,
  MathView,
  MentionView,
  renderMath,
  clickSelectFigure,
  ImageView,
  IFrameView,
  LinkView,
  TimeView,
  WidgetView,
  newWidgetView,
  CodeBlockView,
  FootnoteView,
};
