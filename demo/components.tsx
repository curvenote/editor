import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef } from 'react';
import thunkMiddleware from 'redux-thunk';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { DOMParser, NodeSpec, Node, Schema } from 'prosemirror-model';
import FaceOutlined from '@material-ui/icons/FaceOutlined';
import { Chip } from '@material-ui/core';
import { Provider } from 'react-redux';
import suggestion from '../src/prosemirror/plugins/suggestion';
import rootReducer from './reducers';
import { closeSuggestion, handleSuggestion } from '../src/store/actions';
import middlewares from '../src/store/middleware';
import { Suggestions, SuggestionSwitch } from '../src';
import { getSuggestion } from '../src/store/selectors';
import './components.css';

const store = createStore(rootReducer, applyMiddleware(...[thunkMiddleware, ...middlewares]));

function ChipWithIcon({ label, avatar }: { label: string; avatar: string }) {
  return (
    <Chip
      icon={
        avatar ? (
          <img
            style={{ display: 'inline-block', borderRadius: 9999 }}
            width={24}
            height={24}
            src={avatar}
            alt={`${label} avatar`}
          />
        ) : (
          <FaceOutlined />
        )
      }
      label={label}
      variant="outlined"
    />
  );
}

class MentionView {
  node: Node;

  view: EditorView;

  getPos: boolean | (() => number);

  dom: HTMLSpanElement;

  constructor(node: Node, view: EditorView, getPos: boolean | (() => number)) {
    // We'll need these later
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    // The node's representation in the editor (empty, for now)
    const wrapper = document.createElement('span');
    ReactDOM.render(<ChipWithIcon label={node.attrs.label} avatar={node.attrs.avatar} />, wrapper);
    this.dom = wrapper;
  }
}

function createEditorState() {
  const nodes: Record<string, NodeSpec> = {
    doc: {
      content: 'block*',
    },
    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0];
      },
    },

    // :: NodeSpec The text node.
    text: {
      group: 'inline',
    },

    mention: {
      attrs: { label: { default: '' }, avatar: { default: '' } },
      inline: true,
      atom: true,
      group: 'inline',
      draggable: true,
      selectable: true,
      toDOM(node: any) {
        const { label, avatar } = node.attrs;
        return ['span', { label, avatar, class: 'mention' }];
      },
      parseDOM: [
        {
          tag: 'span.mention[label][avatar]',
          getAttrs(dom) {
            if (typeof dom !== 'string') {
              const label = (dom as HTMLSpanElement).getAttribute('label');
              const avatar = (dom as HTMLSpanElement).getAttribute('avatar');
              return {
                label,
                avatar,
              };
            }
            return { label: '', avatar: '' };
          },
        },
      ],
    },
  };

  const mentionInputSchema = new Schema({
    nodes,
  });
  const contentNode = document.getElementById('componentContent') as HTMLElement;

  return EditorState.create({
    doc: DOMParser.fromSchema(mentionInputSchema).parse(contentNode),
    schema: mentionInputSchema,
    plugins: [
      ...suggestion(
        (action) => {
          if (action.kind === 'close') {
            // remove text
            const {
              view,
              range: { from, to },
            } = getSuggestion(store.getState());
            if (!view) return true;
            const { tr } = view.state;
            tr.insertText('', from, to);
            view.dispatch(tr);

            // create mention component
            const { selected: selectedIndex, results } = getSuggestion(store.getState());
            const selected = results[selectedIndex] as any;
            const mention = view.state.schema.nodes.mention.create({
              label: selected.email,
              avatar: selected.avatar || '',
            } as any);
            store.dispatch(closeSuggestion() as any);
            view.dispatch(view.state.tr.insert(from, mention).scrollIntoView());
            return true;
          }
          store.dispatch(handleSuggestion(action) as any);
          return true;
        },
        /(?:^|\W)(@)$/,
        // Cancel on space after some of the triggers
        (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
      ),
    ],
  });
}

function InputWithMention() {
  const editorViewRef = useRef<EditorView | null>(null);
  const editorDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorDivRef.current) {
      return () => {};
    }
    const state = createEditorState();
    editorViewRef.current = new EditorView(
      { mount: editorDivRef.current },
      {
        state,
        clipboardTextSerializer: (slice) => {
          let str = '';
          slice.content.forEach((node) => {
            if (node.type.name === 'mention') {
              str += node.attrs.label;
            }
          });
          return str;
        },
        nodeViews: {
          mention(node, view, getPos) {
            return new MentionView(node, view, getPos);
          },
        },
      },
    );

    return () => {
      editorViewRef.current?.destroy();
    };
  }, []);

  return <div ref={editorDivRef} />;
}

function ComponentDemo() {
  return (
    <div>
      <InputWithMention />
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <ComponentDemo />
    <Suggestions>
      <SuggestionSwitch />
    </Suggestions>
  </Provider>,
  document.getElementById('components'),
);
