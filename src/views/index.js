import MathView, { renderMath } from './MathView';
import ImageView from './ImageView';
import IFrameView from './IFrameView';
import LinkView from './LinkView';
import TimeView from './TimeView';
import createNodeView from './NodeView';
import CodeBlockView from './CodeBlockView';
import FootnoteView from './FootnoteView';
import WidgetView, { newWidgetView } from './WidgetView';
import { clickSelectFigure } from './utils';
export default {
    createNodeView: createNodeView,
    MathView: MathView,
    renderMath: renderMath,
    clickSelectFigure: clickSelectFigure,
    ImageView: ImageView,
    IFrameView: IFrameView,
    LinkView: LinkView,
    TimeView: TimeView,
    WidgetView: WidgetView,
    newWidgetView: newWidgetView,
    CodeBlockView: CodeBlockView,
    FootnoteView: FootnoteView,
};
//# sourceMappingURL=index.js.map