/* eslint-disable react/jsx-props-no-spreading */
import { EditorState, NodeSelection, Plugin } from 'prosemirror-state';
import Fuse from 'fuse.js';
import { EditorView } from 'prosemirror-view';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Node, NodeSpec, Schema } from 'prosemirror-model';
import FaceOutlined from '@material-ui/icons/FaceOutlined';
import CloseIcon from '@material-ui/icons/Close';
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
  Grow,
  Theme,
} from '@material-ui/core';
import { keymap } from 'prosemirror-keymap';
import { findParentNodeOfType } from 'prosemirror-utils';
import { v4 } from 'uuid';
import useClickOutside from './hooks/useClickOutside';

const newUserIdPrefix = 'new';
function generateNewUserId() {
  return `${newUserIdPrefix}-${v4()}`;
}

// https://stackoverflow.com/a/46181
function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

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
  ) : null;
}

const Chip = withStyles({
  root: {
    height: 28,
  },
  label: { paddingLeft: 8, paddingRight: 8, fontSize: 14 },
})(MuiChip);

const useChipStyle = makeStyles<Theme, { backgroundColor: string }>(
  createStyles({
    root: {
      border: ({ backgroundColor }) => `1px solid ${backgroundColor}`,
    },
  }),
);

function Mention({
  label,
  avatar,
  mentionId,
  onDelete,
}: {
  label: string;
  avatar: string;
  mentionId: string;
  onDelete: () => void;
}) {
  const newMentionBg = validateEmail(label) ? '#60A5FA' : '#FCA5A5';
  const classes = useChipStyle({
    backgroundColor: mentionId.startsWith(newUserIdPrefix) ? newMentionBg : '#d7d7d7',
  });
  return (
    <Chip
      icon={<AvatarWithFallback label={label} avatar={avatar} />}
      className={classes.root}
      label={label}
      variant="outlined"
      onDelete={onDelete}
      deleteIcon={<CloseIcon />}
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
        mentionId={node.attrs.id}
      />,
      wrapper,
    );
    this.dom = wrapper;
  }
}

const COMPLETION_KEY = [',', 'Tab', ' '];
const ENABLED_KEYS_FOR_MENTION_NODE = ['Backspace', 'ArrowLeft', 'ArrowRight'];
function getAutoCompleteState(view: EditorView): AutoCompleteState | undefined {
  const { $from } = view.state.selection;
  const { nodeBefore, pos } = $from;
  if (nodeBefore?.text) {
    return { str: nodeBefore.text, range: [$from.start(), pos] };
  }
}

interface AutoCompleteState {
  str: string;
  range: [number, number];
}
function createEditorState(
  dispatchA: any,
  onSelect: (key: 'Enter' | 'Tab', autoCompleteState: AutoCompleteState | undefined) => void,
  onComplete: (arg: AutoCompleteState | undefined) => void,
) {
  const nodes: Record<string, NodeSpec> = {
    doc: {
      content: 'mention* autocomplete',
    },
    // :: NodeSpec The text node.
    text: {},
    autocomplete: {
      content: 'text*',
      toDOM() {
        return ['span', { class: 'autocomplete' }, 0];
      },
      parseDOM: [
        {
          tag: 'span.autocomplete',
        },
      ],
    },
    mention: {
      attrs: { label: { default: '' }, avatar: { default: '' }, id: { default: '' } },
      // inline: true,
      atom: true,
      draggable: true,
      selectable: true,
      toDOM(node: any) {
        const { label, avatar, id } = node.attrs;
        return ['span', { label, avatar, class: 'mention', id }];
      },
      parseDOM: [
        {
          tag: 'span.mention[label][avatar][id]',
          getAttrs(dom): MentionNodeAttrState {
            if (typeof dom !== 'string') {
              const label = (dom as HTMLSpanElement).getAttribute('label');
              const avatar = (dom as HTMLSpanElement).getAttribute('avatar');
              const id = (dom as HTMLSpanElement).getAttribute('id');
              return { label: label || '', avatar: avatar || '', id: id || '' };
            }
            return { label: '', avatar: '', id: '' };
          },
        },
      ],
    },
  };

  const mentionInputSchema = new Schema({
    nodes,
  });

  return EditorState.create({
    doc: mentionInputSchema.node('doc', {}, mentionInputSchema.node('autocomplete')), // to create a paragraph at the start, nodeSize will be 4 which is used to determin whether the content is empty
    schema: mentionInputSchema,
    plugins: [
      new Plugin({
        props: {
          handleKeyDown(view: EditorView, event: KeyboardEvent) {
            const { node } = view.state.selection as NodeSelection;
            if (node && isMention(node)) {
              if (ENABLED_KEYS_FOR_MENTION_NODE.find((k) => event.key === k)) {
                return false;
              }
              return true;
            }

            if (event.key === 'Enter' || event.key === 'Tab') {
              onSelect(event.key, getAutoCompleteState(view));
              return true;
            }

            if (event.key === 'ArrowUp') {
              dispatchA({ type: 'incActive', payload: { inc: -1 } });
              return true;
            }

            if (event.key === 'ArrowDown') {
              dispatchA({ type: 'incActive', payload: { inc: 1 } });
              return true;
            }

            if (COMPLETION_KEY.includes(event.key)) {
              onComplete(getAutoCompleteState(view));
              return true;
            }

            return false;
          },
          handleDOMEvents: {},
        },
      }),
      // ...autocomplete(options),
      keymap({
        Backspace: (state, dispatch) => {
          const { $head } = state.selection;
          const {
            tr,
            selection: {
              ranges: [range],
            },
          } = state;

          // if it's a single selection
          if (!range) {
            return false;
          }

          if (
            (state.selection as NodeSelection).node &&
            (state.selection as NodeSelection).node.type.name === 'mention'
          ) {
            const { node } = state.selection as NodeSelection;
            dispatch?.(tr.delete($head.pos - 1, $head.pos - 1 + node.nodeSize));
            return true;
          }

          if (range.$from.pos !== range.$to.pos) {
            return false;
          }

          if (state.selection.$from.parent.type.name === 'autocomplete') {
            if ($head.start() === $head.pos) {
              const parent = findParentNodeOfType(state.schema.nodes.autocomplete)(state.selection);
              if (parent) {
                dispatch?.(tr.setSelection(NodeSelection.create(state.doc, parent.pos - 1)));
                return true;
              }
            }
            return false;
          }

          return false;
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

const mentionPopupId = 'mention-popup';
function constrainActive(v: number, length: number) {
  if (v < 0) {
    return length - 1;
  }
  return v % length;
}

interface SuggestionActionState {
  range: { from: number; to: number } | null;
  search: string;
}

interface MentionNodeAttrState {
  label: string;
  avatar: string;
  id: string;
}

const initialState = {
  suggestions: [] as PersonSuggestion[],
  active: 0,
  action: { range: null, search: '' } as SuggestionActionState,
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
      };
    }
  | { type: 'resetActive' }
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
    case 'resetActive': {
      return {
        ...state,
        active: 0,
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
      '& .autocomplete': {
        verticalAlign: 'middle',
      },
      '& .ProseMirror-trailingBreak': {
        display: 'none', // hide trailing break
      },
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

export default function MentionInput({
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
    const searchStr = state.action.search;
    if (!searchStr) {
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
  }, [fuse, state.action.search]);

  useEffect(() => {
    onSearchChanged(state.action.search);
  }, [state.action.search]);

  function clearText(view: EditorView, range: { from: number; to: number }) {
    const { from, to } = range;
    const { tr } = view.state;
    tr.insertText('', from, to);
    view.dispatch(tr);
  }

  function addMention(view: EditorView, mentionAttrState: MentionNodeAttrState, pos: number) {
    // create mention component
    const mention = view.state.schema.nodes.mention.create(mentionAttrState);
    view.dispatch(view.state.tr.insert(pos, mention).scrollIntoView());
  }

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

      clearText(view, current.action.range);
      dispatch({ type: 'resetActive' });
      dispatch({ type: 'close' });

      const selectedSuggestion = current.suggestions[current.active];
      if (!selectedSuggestion) {
        return;
      }

      const { from } = current.action.range;
      addMention(
        view,
        {
          label: selectedSuggestion.name || selectedSuggestion.email,
          avatar: selectedSuggestion.avatar || '',
          id: selectedSuggestion.id,
        },
        from,
      );
    },
    [mentions],
  );

  useEffect(() => {
    if (!editorDivRef.current) {
      return () => {};
    }

    function clearAndInsertMention(autoCompleteState: AutoCompleteState) {
      if (!editorViewRef.current) {
        return;
      }
      const {
        str,
        range: [from, to],
      } = autoCompleteState;
      clearText(editorViewRef.current, { from, to });
      const label = str;
      addMention(
        editorViewRef.current,
        { label, avatar: '', id: generateNewUserId() }, // TODO: hash id
        editorViewRef.current.state.selection.$from.start() - 1,
      );
    }

    const prosemirrorState = createEditorState(
      dispatch,
      (key, autocompleteState) => {
        if (!stateRef.current || !autocompleteState) {
          return;
        }
        if (stateRef.current.suggestions.length === 0) {
          clearAndInsertMention(autocompleteState);
          return;
        }
        addActiveToMention();
      },
      (autocompleteState) => {
        if (!editorViewRef.current || !autocompleteState) {
          return;
        }
        clearAndInsertMention(autocompleteState);
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
        dispatchTransaction: (tr) => {
          const newState = editorView.state.apply(tr);
          editorView.updateState(newState);
          // doc change flag is checked after doc change is applied for sideeffects
          if (!tr.docChanged) {
            return;
          }
          const updatedMentions: PersonSuggestion[] = [];
          editorView.state.doc.content.forEach((n) => {
            if (n.type.name === 'mention') {
              const mention = suggestions.find(({ id }) => id === n.attrs.id);
              if (mention) {
                updatedMentions.push(mention);
              } else {
                updatedMentions.push({
                  email: n.attrs.label,
                  name: 'new user',
                  id: n.attrs.id,
                  avatar: '',
                });
              }
            }
          });
          setMentions(updatedMentions);

          // input handling
          const view = editorView;
          view.state.doc.descendants((n, pos) => {
            if (n.type.name === 'autocomplete') {
              if (n.textContent) {
                if (!state.isOpen) {
                  dispatch({ type: 'open' });
                }
                dispatch({
                  type: 'updateAction',
                  payload: {
                    range: { from: pos, to: pos + n.nodeSize },
                    search: n.textContent,
                  },
                });
              } else {
                dispatch({ type: 'close' });
              }
            }
          });
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

  useClickOutside(editorDivRef, () => {
    if (state.isOpen) {
      dispatch({ type: 'close' });
    }
  });

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
          id={mentionPopupId}
          open={state.isOpen}
          anchorEl={editorDivRef.current}
          className={popperclasses}
          placement="bottom-start"
          transition
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={200}>
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
                      sx={{
                        py: 0.5,
                        bgcolor: 'background.paper',
                        minWidth: 100,
                      }}
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
            </Grow>
          )}
        </Popper>
      )}
    </Box>
  );
}
