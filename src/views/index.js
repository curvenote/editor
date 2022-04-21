import { MathView, EquationView, renderMath } from './MathView';
import { ImageView } from './ImageView';
import { IFrameView } from './IFrameView';
import { LinkView } from './LinkView';
import { createLinkBlockView } from './LinkBlockView';
import { TimeView } from './TimeView';
import { MentionView } from './Mention';
import { CodeBlockView } from './CodeBlockView';
import { FootnoteView } from './FootnoteView';
import createNodeView from './NodeView';
import WidgetView, { newWidgetView } from './WidgetView';
import { clickSelectFigure } from './utils';
export default {
    createNodeView: createNodeView,
    MathView: MathView,
    EquationView: EquationView,
    MentionView: MentionView,
    renderMath: renderMath,
    clickSelectFigure: clickSelectFigure,
    ImageView: ImageView,
    IFrameView: IFrameView,
    LinkView: LinkView,
    createLinkBlockView: createLinkBlockView,
    TimeView: TimeView,
    WidgetView: WidgetView,
    newWidgetView: newWidgetView,
    CodeBlockView: CodeBlockView,
    FootnoteView: FootnoteView,
};
//# sourceMappingURL=index.js.map