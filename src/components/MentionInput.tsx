import { EditorState, NodeSelection, Plugin } from 'prosemirror-state';
import Fuse from 'fuse.js';
import { EditorView } from 'prosemirror-view';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Node, NodeSpec, Schema } from 'prosemirror-model';
import FaceOutlined from '@material-ui/icons/FaceOutlined';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import classnames from 'classnames';
import {
  Box,
  Chip as MuiChip,
  createStyles,
  TextField,
  FormControl,
  InputLabel,
  makeStyles,
  Paper,
  Popper,
  Typography,
  withStyles,
} from '@material-ui/core';
import { keymap } from 'prosemirror-keymap';
import suggestion, {
  SuggestionAction,
  SuggestionActionKind,
} from '../prosemirror/plugins/suggestion';

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
  root: {
    height: 28,
  },
  label: { paddingLeft: 4, paddingRight: 8, fontSize: 12 },
})(MuiChip);

function Mention({
  label,
  avatar,
  onDelete,
}: {
  label: string;
  avatar: string;
  onDelete: () => void;
}) {
  return (
    <Chip
      icon={<AvatarWithFallback label={label} avatar={avatar} />}
      label={label}
      variant="outlined"
      onDelete={onDelete}
      deleteIcon={<CancelRoundedIcon />}
    />
  );
}

function isMention(node: Node) {
  return node.type.name === 'mention';
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
    wrapper.classList.add('chip-container');
    ReactDOM.render(
      <Mention
        onDelete={() => {
          const {
            state: { tr },
            dispatch,
          } = this.view;
          if (typeof getPos === 'boolean') {
            return;
          }
          const pos = getPos() as number;
          dispatch(tr.delete(pos, pos + node.nodeSize));
        }}
        label={node.attrs.label}
        avatar={node.attrs.avatar}
      />,
      wrapper,
    );
    this.dom = wrapper;
  }
}

function createEditorState(
  actionHandler: any,
  onDelete: (deleted: { label: string; avatar: string }) => void,
) {
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

  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight'];
  return EditorState.create({
    doc: mentionInputSchema.node('doc', {}, mentionInputSchema.node('paragraph', {})), // to create a paragraph at the start, nodeSize will be 4 which is used to determin whether the content is empty
    schema: mentionInputSchema,
    plugins: [
      new Plugin({
        props: {
          handleKeyDown(view: EditorView, event: KeyboardEvent) {
            const { node } = view.state.selection as NodeSelection;
            if (node && isMention(node)) {
              if (allowedKeys.find((k) => event.key === k)) {
                return false;
              }
              return true;
            }
            return false;
          },
        },
      }),
      ...suggestion(
        actionHandler,
        /(?:^|\W)([\s@a-zA-Z0-9])$/,
        // Cancel on space after some of the triggers
        (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
      ),
      keymap({
        Backspace: (state, dispatch) => {
          const { $head } = state.selection;
          const { tr } = state;
          if (
            (state.selection as NodeSelection).node &&
            (state.selection as NodeSelection).node.type.name === 'mention'
          ) {
            const { node } = state.selection as NodeSelection;
            dispatch?.(tr.delete($head.pos - 1, $head.pos + node.nodeSize));
            onDelete(node.attrs as any);
            return true;
          }
          const possibleMention = state.selection.$head.nodeBefore;
          if (!possibleMention) return false;
          if (possibleMention.type.name !== 'mention') {
            return false;
          }
          const figPos = state.selection.$head.pos - possibleMention.nodeSize;
          dispatch?.(tr.setSelection(NodeSelection.create(tr.doc, figPos)).scrollIntoView());
          return true;
        },
      }),
    ],
  });
}

export interface PersonSuggestion {
  id: string;
  avatar: string;
  email: string;
  name: string;
}

const id = 'mention-popup';
function constrainActive(v: number, length: number) {
  if (v < 0) {
    return length - 1;
  }
  return v % length;
}

interface SuggestionActionState {
  range: { from: number; to: number } | null;
  search: string;
  trigger: string;
}

const initialState = {
  suggestions: [] as PersonSuggestion[],
  active: 0,
  action: { range: null, search: '', trigger: '' } as SuggestionActionState,
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
      payload: {
        range: { from: number; to: number };
        search: string | null;
        trigger: string | null;
      };
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
        action: {
          range: action.payload.range,
          search: action.payload.search || '',
          trigger: action.payload.trigger || '',
        },
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
    editor: {
      padding: '5px 0',
    },
    suggestionListContainer: {
      position: 'relative',
      minWidth: 150,
      maxHeight: 350,
      overflow: 'auto',
      margin: '10px 0',
    },
    suggestionItem: { cursor: 'pointer' },
    prosemirrorContainer: {
      position: 'relative',
      '& p': {
        margin: 0,
        lineHeight: 2, // 2 expecting icon to be thicker than text
      },
      '& .chip-container': {
        display: 'inline-block',
        padding: '2px 2px 2px 0',
      },
      '& .Mui-focused': {
        outline: 'none',
      },
      '& .ProseMirror-selectednode > div': {
        outline: '2px solid #8cf',
      },
      '& .ProseMirror': {
        alignItems: 'center',
        flexWrap: 'wrap',
      },
    },
  }),
);

function removeItemImmutable<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1, arr.length - 1)];
}

function getFilterFromAction({ search, trigger }: SuggestionActionState) {
  if (!trigger.match(/[a-zA-Z0-9]/)) {
    return search;
  }
  return trigger + search;
}

export default function InputWithMention({
  suggestions,
  underlineClassName = 'MuiInput-underline',
  popperClasses: popperclasses = '',
  onBlur,
  onSearchChanged,
  dropdownZIndex = 'auto',
  onChange,
}: {
  onSearchChanged: (update: string | null) => void;
  suggestions: PersonSuggestion[];
  onBlur?: () => void;
  popperClasses?: string;
  underlineClassName?: string;
  dropdownZIndex?: 'auto' | number;
  onChange: (update: PersonSuggestion[]) => void;
}) {
  const classes = useStyles();
  const editorViewRef = useRef<EditorView | null>(null);
  const [mentions, setMentions] = useState<PersonSuggestion[]>([]);
  const editorDivRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);
  stateRef.current = state;
  const { active } = state;
  const [fuse, setFuse] = useState<Fuse<PersonSuggestion> | null>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  function incActive(v: number) {
    dispatch({ type: 'incActive', payload: { inc: v } });
  }

  useEffect(() => {
    dispatch({ type: 'updateSuggestions', payload: { suggestions } });
    const newFuse = new Fuse(suggestions, { keys: ['email', 'name'] });
    setFuse(newFuse);
  }, [suggestions]);

  useEffect(() => {
    onChange(mentions);
  }, [mentions]);

  useEffect(() => {
    if (!fuse) {
      return;
    }
    const searchStr = getFilterFromAction(state.action);
    if (!state.action.trigger || !searchStr) {
      dispatch({ type: 'updateSuggestions', payload: { suggestions } });
      return;
    }
    const result = fuse.search(searchStr).map((v) => v.item);
    dispatch({
      type: 'updateSuggestions',
      payload: {
        suggestions: result,
      },
    });
  }, [fuse, state.action]);

  useEffect(() => {
    onSearchChanged(getFilterFromAction(state.action));
  }, [state.action]);

  const addActiveToMention = useCallback(
    function addActiveToMention() {
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
      if (!selectedSuggestion) {
        return;
      }
      // create mention component
      const mention = view.state.schema.nodes.mention.create({
        label: selectedSuggestion.name || selectedSuggestion.email,
        avatar: selectedSuggestion.avatar || '',
      } as any);
      view.dispatch(view.state.tr.insert(from, mention).scrollIntoView());
      setMentions((m) => m.concat([selectedSuggestion]));
    },
    [mentions],
  );

  useEffect(() => {
    if (!editorDivRef.current) {
      return () => {};
    }
    const prosemirrorState = createEditorState(
      (action: SuggestionAction) => {
        if (action.kind === SuggestionActionKind.open) {
          dispatch({ type: 'open' });
          dispatch({
            type: 'updateAction',
            payload: { range: action.range, search: action.search, trigger: action.trigger },
          });
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
        if (action.kind === SuggestionActionKind.filter) {
          dispatch({
            type: 'updateAction',
            payload: { range: action.range, search: action.search, trigger: action.trigger },
          });
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
      },
      (deleted) => {
        // TODO: a more definitive dientification is preferred
        setMentions((m) => {
          const index = m.findIndex(
            ({ name, email }) => name === deleted.label || email === deleted.label,
          );
          if (index === -1) {
            return m;
          }
          return removeItemImmutable(m, index);
        });
      },
    );

    const editorView = new EditorView(
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

    editorViewRef.current = editorView;

    return () => {
      editorViewRef.current?.destroy();
    };
  }, []);

  const [focused, setFocus] = useState(false);
  const nodeSize = editorViewRef.current?.state.doc.nodeSize;

  useEffect(() => {
    if (editorDivRef.current) {
      const focusListener = () => {
        setFocus(true);
      };
      const onFocusoutListener = () => {
        onBlur?.();
        setFocus(false);
      };
      editorDivRef.current.addEventListener('focus', focusListener);
      editorDivRef.current.addEventListener('focusout', onFocusoutListener);
      return () => {
        editorDivRef.current?.removeEventListener('focus', focusListener);
        editorDivRef.current?.removeEventListener('focusout', onFocusoutListener);
      };
    }
    return () => {};
  }, [editorDivRef.current]);

  return (
    <Box width={500} color="primary">
      <FormControl fullWidth>
        <InputLabel shrink={nodeSize !== 4 || focused} focused={focused}>
          Add people and groups
        </InputLabel>
        <Box marginTop="15px" className={classnames(classes.prosemirrorContainer)}>
          <div
            ref={editorDivRef}
            className={classnames(classes.editor, underlineClassName, { 'Mui-focused': focused })}
          />
        </Box>
        <TextField style={{ display: 'none' }} />
      </FormControl>
      {editorDivRef.current && (
        <Popper
          id={id}
          open={state.isOpen}
          anchorEl={editorDivRef.current}
          className={popperclasses}
          placement="bottom-start"
        >
          <Paper
            className={classes.suggestionListContainer}
            elevation={10}
            ref={paperRef}
            style={{ width: 500, zIndex: dropdownZIndex }}
          >
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
      )}
    </Box>
  );
}
