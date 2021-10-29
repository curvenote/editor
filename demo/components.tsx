import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { KeyboardEventHandler, useCallback, useEffect, useReducer, useRef } from 'react';
import thunkMiddleware from 'redux-thunk';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { DOMParser, Node, NodeSpec, Schema } from 'prosemirror-model';
import FaceOutlined from '@material-ui/icons/FaceOutlined';
import {
  Box,
  Chip as MuiChip,
  createStyles,
  makeStyles,
  Paper,
  Popper,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Provider } from 'react-redux';
import suggestion, {
  SuggestionAction,
  SuggestionActionKind,
} from '../src/prosemirror/plugins/suggestion';
import rootReducer from './reducers';
import middlewares from '../src/store/middleware';
import './components.css';
import { anchorEl } from '../src/components/Suggestion/Popper';
import useClickOutside from '../src/components/hooks/useClickOutside';

const store = createStore(rootReducer, applyMiddleware(...[thunkMiddleware, ...middlewares]));

function AvatarWithFallback({
  avatar,
  label,
  width = 24,
  height = 24,
}: {
  avatar: string;
  label: string;
  width?: number;
  height?: number;
}) {
  return avatar ? (
    <img
      style={{ display: 'inline-block', borderRadius: 9999, paddingLeft: 2 }}
      width={width}
      height={height}
      src={avatar}
      alt={`${label} avatar`}
    />
  ) : (
    <FaceOutlined />
  );
}

const Chip = withStyles({
  label: { paddingLeft: 4, paddingRight: 8 },
})(MuiChip);

function ChipWithIcon({ label, avatar }: { label: string; avatar: string }) {
  return (
    <Chip
      icon={<AvatarWithFallback label={label} avatar={avatar} />}
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

function createEditorState(actionHandler: any) {
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
        actionHandler,
        /(?:^|\W)(@)$/,
        // Cancel on space after some of the triggers
        (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
      ),
    ],
  });
}

interface MentionUser {
  avatar: string;
  email: string;
  name: string;
}

const TEST_MENTION_LIST: MentionUser[] = [
  { avatar: '', email: 'test1@gmail.com', name: '' },
  {
    avatar:
      'https://storage.googleapis.com/iooxa-prod-1.appspot.com/photos/WeYvKUTFnSQOET5tyvW9TgLQLwb2?version=1629496337760',
    email: 'yuxi@curvenote.com',
    name: 'Yuxi',
  },
];

const id = 'mention-popup';
function constrainActive(v: number, length: number) {
  if (v < 0) {
    return length - 1;
  }
  return v % length;
}

const initialState = {
  mentions: [] as MentionUser[],
  active: 0,
  isOpen: false,
  range: null as { from: number; to: number } | null,
};
type MentionState = typeof initialState;

type Actions =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'incActive'; payload: { inc: number } }
  | { type: 'updateRange'; payload: { range: { from: number; to: number } } }
  | { type: 'selectActiveMention' }
  | { type: 'updateMentions'; payload: { mentions: MentionUser[] } };

function reducer(state: MentionState, action: Actions) {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        isOpen: true,
      };
    case 'close':
      return {
        ...state,
        isOpen: false,
      };
    case 'updateRange':
      return {
        ...state,
        range: action.payload.range,
      };
    case 'incActive':
      return {
        ...state,
        active: constrainActive(state.active + action.payload.inc, state.mentions.length),
        mentions: state.mentions,
      };
    case 'selectActiveMention': {
      return {
        ...state,
        active: 0,
        isOpen: false,
      };
    }
    case 'updateMentions':
      return {
        ...state,
        active: 0,
        mentions: action.payload.mentions,
      };
    default:
      throw new Error();
  }
}

function getActiveMention(state: MentionState) {
  return state.mentions[state.active];
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minWidth: 200,
      maxWidth: 500,
      maxHeight: 350,
      overflow: 'auto',
      margin: '10px 0',
    },
  }),
);

function InputWithMention({
  onMentionAdded = () => {},
}: {
  onMentionAdded?: (mention: MentionUser) => void;
}) {
  const classes = useStyles();
  const editorViewRef = useRef<EditorView | null>(null);
  const editorDivRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);
  stateRef.current = state;
  const { active, mentions } = state;
  const paperRef = useRef<HTMLDivElement>(null);
  useClickOutside(paperRef, () => {
    dispatch({ type: 'close' });
  });

  function incActive(v: number) {
    dispatch({ type: 'incActive', payload: { inc: v } });
  }

  useEffect(() => {
    // TODO: load mentions?
    dispatch({ type: 'updateMentions', payload: { mentions: TEST_MENTION_LIST } });
  }, []);

  const addActiveToMention = useCallback(function addActiveToMention() {
    const { current: view } = editorViewRef;
    if (!stateRef.current) {
      return;
    }
    const { current } = stateRef;
    if (!view || !current.range) {
      return;
    }
    const { from, to } = current.range;
    const { tr } = view.state;
    tr.insertText('', from, to);
    view.dispatch(tr);

    dispatch({ type: 'selectActiveMention' });

    const selectedMention = current.mentions[current.active];
    // create mention component
    const mention = view.state.schema.nodes.mention.create({
      label: selectedMention.name || selectedMention.email,
      avatar: selectedMention.avatar || '',
    } as any);
    view.dispatch(view.state.tr.insert(from, mention).scrollIntoView());
    onMentionAdded(getActiveMention(state));
  }, []);

  useEffect(() => {
    if (!editorDivRef.current) {
      return () => {};
    }
    const prosemirrorState = createEditorState((action: SuggestionAction) => {
      dispatch({ type: 'updateRange', payload: { range: action.range } });
      if (action.kind === SuggestionActionKind.open) {
        dispatch({ type: 'open' });
        return true;
      }
      if (action.kind === SuggestionActionKind.previous) {
        incActive(-1);
        return true;
      }
      if (action.kind === SuggestionActionKind.next) {
        incActive(1);
        return true;
      }
      if (action.kind === SuggestionActionKind.close) {
        dispatch({ type: 'close' });
        return true;
      }
      if (action.kind === SuggestionActionKind.select) {
        // remove text
        addActiveToMention();

        return true;
      }
      // store.dispatch(handleSuggestion(action) as any);
      return true;
    });

    editorViewRef.current = new EditorView(
      { mount: editorDivRef.current },
      {
        state: prosemirrorState,
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

  const onKeyDown: KeyboardEventHandler<HTMLElement> = useCallback(function onKeyDown(e) {
    console.log(e.key);
  }, []);

  return (
    <>
      <div ref={editorDivRef} />
      <Popper id={id} open={state.isOpen} anchorEl={anchorEl} placement="bottom-start">
        <Paper className={classes.root} elevation={10} ref={paperRef}>
          {state.mentions.map(({ email, name, avatar }, i) => {
            const key = `${email || name}-suggestion-item`;
            return (
              <Box
                key={key}
                display="flex"
                onMouseEnter={addActiveToMention}
                onKeyDown={onKeyDown}
                onClick={addActiveToMention}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                sx={{ border: 1, py: 0.25, px: 0.5, bgcolor: 'background.paper', minWidth: 100 }}
                style={active === i ? { backgroundColor: '#e8e8e8' } : {}}
              >
                <Box
                  pr={1}
                  width={24}
                  height={24}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <AvatarWithFallback
                    width={18}
                    height={18}
                    label={name || email}
                    avatar={avatar}
                  />
                </Box>
                <Box display="flex" flexDirection="column" flexGrow={3}>
                  <Typography style={{ fontSize: 12 }}>{name || email}</Typography>
                </Box>
              </Box>
            );
          })}
        </Paper>
      </Popper>
    </>
  );
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
  </Provider>,
  document.getElementById('components'),
);
