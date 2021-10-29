import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
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
    <FaceOutlined style={{ width, height }} />
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

interface PersonSuggestion {
  avatar: string;
  email: string;
  name: string;
}

const TEST_SUGGESTION_LIST: PersonSuggestion[] = [
  {
    avatar: 'https://lh3.googleusercontent.com/a-/AOh14Gg7MefXJ_MF1oDEiNThKLfOUwWy6p3P73ZrQkDq',
    email: 'stevejpurves@curvenote.com',
    name: 'stevejpurves',
  },
  {
    avatar:
      'https://storage.googleapis.com/iooxa-prod-1.appspot.com/photos/vKndfPAZO7WeFxLH1GQcpnXPzfH3?version=1601936136496',
    email: 'rowanc1@curvenote.com',
    name: 'rowanc1',
  },
  {
    avatar:
      'https://uploads-ssl.webflow.com/60ff0a25e3004400049dc542/611c16f84578e9136ea70668_1590515756464.jpg',
    email: 'liz@curvenote.com',
    name: 'liz',
  },
  {
    avatar:
      'https://storage.googleapis.com/iooxa-prod-1.appspot.com/photos/WeYvKUTFnSQOET5tyvW9TgLQLwb2?version=1629496337760',
    email: 'yuxi@curvenote.com',
    name: 'Yuxi',
  },
  { avatar: '', email: 'test1@gmail.com', name: '' },
];

const id = 'mention-popup';
function constrainActive(v: number, length: number) {
  if (v < 0) {
    return length - 1;
  }
  return v % length;
}

const initialState = {
  suggestions: [] as PersonSuggestion[],
  active: 0,
  action: { range: null as { from: number; to: number } | null, search: null as string | null },
  isOpen: false,
};
type SuggestionState = typeof initialState;

type Actions =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'incActive'; payload: { inc: number } }
  | { type: 'setActive'; payload: { active: number } }
  | {
      type: 'updateAction';
      payload: { range: { from: number; to: number }; search: string | null };
    }
  | { type: 'selectActiveSuggestion' }
  | { type: 'updateSuggestions'; payload: { suggestions: PersonSuggestion[] } };

function reducer(state: SuggestionState, action: Actions): SuggestionState {
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
    case 'updateAction':
      return {
        ...state,
        action: { range: action.payload.range, search: action.payload.search },
      };
    case 'incActive':
      return {
        ...state,
        active: constrainActive(state.active + action.payload.inc, state.suggestions.length),
      };
    case 'setActive':
      return {
        ...state,
        active: action.payload.active,
      };
    case 'selectActiveSuggestion': {
      return {
        ...state,
        active: 0,
        isOpen: false,
      };
    }
    case 'updateSuggestions':
      return {
        ...state,
        active: 0,
        suggestions: action.payload.suggestions,
      };
    default:
      throw new Error();
  }
}
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minWidth: 150,
      maxWidth: 250,
      maxHeight: 350,
      overflow: 'auto',
      margin: '10px 0',
    },
    suggestionItem: { cursor: 'pointer' },
  }),
);

function InputWithMention({
  suggestions,
  onSearchChanged,
  onNewMention = () => {},
}: {
  onNewMention: (mention: PersonSuggestion) => void;
  onSearchChanged: (update: string | null) => void;
  suggestions: PersonSuggestion[];
}) {
  const classes = useStyles();
  const editorViewRef = useRef<EditorView | null>(null);
  const editorDivRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);
  stateRef.current = state;
  const { active } = state;
  const paperRef = useRef<HTMLDivElement>(null);
  useClickOutside(paperRef, () => {
    dispatch({ type: 'close' });
  });

  function incActive(v: number) {
    dispatch({ type: 'incActive', payload: { inc: v } });
  }

  useEffect(() => {
    // TODO: load mentions?
    dispatch({ type: 'updateSuggestions', payload: { suggestions } });
  }, [suggestions]);

  useEffect(() => {
    onSearchChanged(state.action.search);
  }, [state.action.search]);

  const addActiveToMention = useCallback(function addActiveToMention() {
    const { current: view } = editorViewRef;
    if (!stateRef.current) {
      return;
    }
    const { current } = stateRef;
    if (!view || !current.action.range) {
      return;
    }
    const { from, to } = current.action.range;
    const { tr } = view.state;
    tr.insertText('', from, to);
    view.dispatch(tr);

    dispatch({ type: 'selectActiveSuggestion' });

    const selectedSuggestion = current.suggestions[current.active];
    // create mention component
    const mention = view.state.schema.nodes.mention.create({
      label: selectedSuggestion.name || selectedSuggestion.email,
      avatar: selectedSuggestion.avatar || '',
    } as any);
    view.dispatch(view.state.tr.insert(from, mention).scrollIntoView());
    onNewMention(selectedSuggestion);
  }, []);

  useEffect(() => {
    if (!editorDivRef.current) {
      return () => {};
    }
    const prosemirrorState = createEditorState((action: SuggestionAction) => {
      dispatch({ type: 'updateAction', payload: { range: action.range, search: action.search } });
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
        addActiveToMention();
        return true;
      }
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

  return (
    <>
      <div ref={editorDivRef} />
      <Popper id={id} open={state.isOpen} anchorEl={anchorEl} placement="bottom-start">
        <Paper className={classes.root} elevation={10} ref={paperRef}>
          {state.suggestions.map(({ email, name, avatar }, i) => {
            const key = `${email || name}-suggestion-item`;
            return (
              <Box
                key={key}
                display="flex"
                onMouseEnter={() => {
                  dispatch({ type: 'setActive', payload: { active: i } });
                }}
                onClick={addActiveToMention}
                className={classes.suggestionItem}
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                sx={{ border: 1, py: 0.25, px: 0.5, bgcolor: 'background.paper', minWidth: 100 }}
                style={active === i ? { backgroundColor: '#e8e8e8' } : {}}
              >
                <Box
                  pr={0.5}
                  width={24}
                  height={24}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <AvatarWithFallback
                    width={20}
                    height={20}
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

function shuffle(array: any) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    // eslint-disable-next-line
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getRandomInt(l: number, h: number) {
  const min = Math.ceil(l);
  const max = Math.floor(h);
  return Math.floor(Math.random() * (max - min) + min);
}

function ComponentDemo() {
  const [suggestions, setSuggestion] = useState(TEST_SUGGESTION_LIST);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuggestion((s) => [...shuffle(s)]);
    }, getRandomInt(500, 1000));
    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  return (
    <div>
      <InputWithMention
        suggestions={suggestions}
        onSearchChanged={(update) => {
          if (!update) {
            return;
          }
          setSearch(update);
          console.log('onSearchChanged', update);
        }}
        onNewMention={(update) => {
          console.log('new mention', update);
        }}
      />
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <ComponentDemo />
  </Provider>,
  document.getElementById('components'),
);
