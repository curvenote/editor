import { migrateHTML } from '@iooxa/schema';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { EditorState, Transaction } from 'prosemirror-state';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { DOMParser as Parser } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { collab } from 'prosemirror-collab';
import schema from './schema';
import suggestion from './plugins/suggestion';
import { buildKeymap } from './keymap';
import inputrules from './inputrules';
import { store } from '../connect';
import * as views from './views';
import { editablePlugin, isEditable } from './plugins/editable';
import { handleSuggestion } from '../store/suggestion/actions';
import linkViewPlugin from './plugins/link';
import commentsPlugin from './plugins/comments';

export { schema };

export function getPlugins(stateKey: any, version: number, startEditable: boolean) {
  return [
    editablePlugin(startEditable),
    ...suggestion(
      (action) => store.dispatch(handleSuggestion(action)),
      /(?:^|\s)(:|\/|(?:(?:^[a-zA-Z0-9_]+)\s?=)|(?:\{\{))$/,
      // Cancel on space after some of the triggers
      (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
    ),
    commentsPlugin(),
    linkViewPlugin,
    views.image.getImagePlaceholderPlugin(),
    inputrules(schema),
    keymap(buildKeymap(stateKey, schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    collab({ version }),
    history(),
  ];
}

export function createEditorState(
  stateKey: any, content: string, version: number, startEditable: boolean,
) {
  const plugins = getPlugins(stateKey, version, startEditable);
  let state: EditorState;
  try {
    const data = JSON.parse(content);
    state = EditorState.fromJSON(
      { schema, plugins },
      { doc: data, selection: { type: 'text', anchor: 0, head: 0 } },
    );
  } catch (error) {
    const element = migrateHTML(content, document, DOMParser);
    const doc = Parser.fromSchema(schema).parse(element);
    state = EditorState.create({ doc, plugins });
  }
  return state;
}

export function createEditorView(
  dom: HTMLDivElement,
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): EditorView {
  const editorView = new EditorView(dom, {
    state,
    dispatchTransaction: dispatch,
    nodeViews: {
      math(node, view, getPos) {
        return new views.MathView(node, view, getPos as () => number, true);
      },
      equation(node, view, getPos) {
        return new views.MathView(node, view, getPos as () => number, false);
      },
      image(node, view, getPos) {
        return new views.ImageView(node, view, getPos as () => number);
      },
      iframe(node, view, getPos) {
        return new views.IFrameView(node, view, getPos as () => number);
      },
      link(node, view, getPos) {
        return new views.LinkView(node, view, getPos as () => number);
      },
      button: views.newWidgetView,
      display: views.newWidgetView,
      dynamic: views.newWidgetView,
      range: views.newWidgetView,
      switch: views.newWidgetView,
      variable: views.newWidgetView,
    },
    // This can be set in the middleware `tr.setMeta(editable, false)`
    editable: (s) => isEditable(s),
    // handleClickOn: (view, pos, node, nodePos, event, direct) => {
    // },
    handlePaste: (view, event, slice) => {
      if (!view.hasFocus()) return true;
      return views.image.uploadAndInsertImages(view, event.clipboardData);
    },
    // clipboardTextSerializer: (slice) => {},
    handleDrop: (view, event, slice, moved) => (
      views.image.uploadAndInsertImages(view, (event as DragEvent).dataTransfer)
    ),
  });
  return editorView;
}
