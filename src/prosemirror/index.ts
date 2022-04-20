import { schemas, fromHTML } from '@curvenote/schema';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { getSelectedViewId } from '../store/selectors';
import { store, opts } from '../connect';
import views from '../views';
import { isEditable } from './plugins/editable';
import { addLink, addLinkBlock } from '../store/actions/utils';
import { getPlugins } from './plugins';
import { uploadAndInsertImages } from './plugins/ImagePlaceholder';
import { selectEditorView } from '../store/actions';

export function createEditorState(
  useSchema: schemas.UseSchema,
  stateKey: any,
  content: string,
  version: number,
  startEditable: boolean,
) {
  const schema = schemas.getSchema(useSchema);
  const plugins = getPlugins(useSchema, schema, stateKey, version, startEditable);
  let state: EditorState;
  try {
    const data = JSON.parse(content);
    state = EditorState.fromJSON(
      { schema, plugins },
      { doc: data, selection: { type: 'text', anchor: 0, head: 0 } },
    );
  } catch (error) {
    const doc = fromHTML(content, schema, document, DOMParser);
    state = EditorState.create({ doc, plugins });
  }
  return state;
}

export function createEditorView(
  dom: HTMLDivElement,
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): EditorView {
  let shiftKey = false; // https://discuss.prosemirror.net/t/change-transformpasted-behaviour-when-shift-key-is-pressed/949/3
  const editorView = new EditorView(
    { mount: dom },
    {
      state,
      dispatchTransaction: dispatch,
      nodeViews: {
        math: views.MathView,
        equation: views.EquationView,
        code_block: views.CodeBlockView,
        footnote: views.FootnoteView,
        image: views.ImageView,
        iframe: views.IFrameView,
        link: views.LinkView,
        link_block: views.createLinkBlockView,
        time: views.TimeView,
        mention: views.MentionView,
        button: views.newWidgetView,
        display: views.newWidgetView,
        dynamic: views.newWidgetView,
        range: views.newWidgetView,
        switch: views.newWidgetView,
        variable: views.newWidgetView,
        ...opts.nodeViews,
      },
      // This can be set in the middleware `tr.setMeta(editable, false)`
      editable: (s) => isEditable(s),
      // handleClickOn: (view, pos, node, nodePos, event, direct) => {
      // },
      handleKeyDown(_, event) {
        shiftKey = event.shiftKey;
        return false;
      },
      handlePaste: (view, event, slice) => {
        if (shiftKey) return false;
        if (!view.hasFocus()) return true;
        const imageInSchema = view.state.schema.nodes.image;
        const uploadIfImagesInSchema = imageInSchema ? uploadAndInsertImages : () => false;
        return (
          opts.handlePaste(view, event, slice) ||
          addLink(view, event.clipboardData) ||
          addLinkBlock(view, event.clipboardData) ||
          uploadIfImagesInSchema(view, event.clipboardData)
        );
      },
      // clipboardTextSerializer: (slice) => {},
      handleDrop: (view, event) => {
        const imageInSchema = view.state.schema.nodes.image;
        const uploadIfImagesInSchema = imageInSchema ? uploadAndInsertImages : () => false;
        return uploadIfImagesInSchema(view, (event as DragEvent).dataTransfer);
      },
      handleClick: (view) => {
        store.dispatch(selectEditorView(view.dom.id));
        return false;
      },
      handleDoubleClick: (view: EditorView<any>, pos: number, event: MouseEvent): boolean => {
        const { viewId, stateId } = getSelectedViewId(store.getState());
        return opts.onDoubleClick(stateId, viewId, view, pos, event);
      },
    },
  );
  return editorView;
}
