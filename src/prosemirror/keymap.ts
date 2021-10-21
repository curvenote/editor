import {
  wrapIn,
  setBlockType,
  chainCommands,
  Command,
  toggleMark,
  exitCode,
  joinUp,
  joinDown,
  lift,
  selectParentNode,
} from 'prosemirror-commands';
import { wrapInList, splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { undo, redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { EditorState, NodeSelection, Transaction } from 'prosemirror-state';
import { store, opts } from '../connect';
import { focusSelectedEditorView } from '../store/ui/actions';
import { executeCommand } from '../store/actions';
import { CommandNames } from '../store/suggestion/commands';
import { createId } from '../utils';
import { nodeNames } from '@curvenote/schema';

type KeyMap = (state: EditorState<Schema>, dispatch?: (p: Transaction<Schema>) => void) => boolean;

const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

export function buildBasicKeymap(schema: Schema, bind?: (key: string, cmd: KeyMap) => void) {
  const keys: { [index: string]: KeyMap } = {};

  const ourBind =
    bind ??
    ((key: string, cmd: KeyMap) => {
      keys[key] = cmd;
    });

  if (schema.marks.strong) {
    ourBind('Mod-b', toggleMark(schema.marks.strong));
    ourBind('Mod-B', toggleMark(schema.marks.strong));
  }
  if (schema.marks.em) {
    ourBind('Mod-i', toggleMark(schema.marks.em));
    ourBind('Mod-I', toggleMark(schema.marks.em));
  }
  if (schema.marks.underline) {
    ourBind('Mod-u', toggleMark(schema.marks.underline));
    ourBind('Mod-U', toggleMark(schema.marks.underline));
  }
  if (schema.marks.code) ourBind('Mod-C', toggleMark(schema.marks.code));
  if (schema.marks.link) {
    const addLink = () => {
      const { viewId } = store.getState().editor.ui;
      store.dispatch(executeCommand(CommandNames.link, viewId));
      return true;
    };
    ourBind('Mod-k', addLink);
    ourBind('Mod-K', addLink);
  }
  return keys;
}

export function buildKeymap(stateKey: any, schema: Schema) {
  const keys: { [index: string]: KeyMap } = {};

  const bind = (key: string, cmd: KeyMap) => {
    keys[key] = cmd;
  };

  const enterCommands: Command[] = [];
  const allUndo = chainCommands(undoInputRule, undo);
  bind('Mod-z', allUndo);
  bind('Backspace', undoInputRule);
  bind('Mod-Z', redo);
  if (!mac) bind('Mod-y', redo);

  bind('Alt-ArrowUp', joinUp);
  bind('Alt-ArrowDown', joinDown);
  bind('Mod-BracketLeft', lift);
  bind(
    'Escape',
    chainCommands(undoInputRule, selectParentNode, () => {
      store.dispatch(focusSelectedEditorView(false));
      return true;
    }),
  );
  // Immediately select the parent
  bind(
    'Shift-Escape',
    chainCommands(undoInputRule, () => {
      store.dispatch(focusSelectedEditorView(false));
      return true;
    }),
  );

  buildBasicKeymap(schema, bind);

  // if (schema.nodes.code_block) bind('Mod-M', setBlockType(schema.nodes.code_block));

  if (schema.nodes.blockquote) bind('Ctrl->', wrapIn(schema.nodes.blockquote));
  if (schema.nodes.hard_break) {
    const br = schema.nodes.hard_break;
    const cmd = chainCommands(exitCode, (state, dispatch) => {
      if (dispatch === undefined) return false;
      dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
      return true;
    });
    bind('Mod-Enter', cmd);
    bind('Shift-Enter', cmd);
    if (mac) bind('Ctrl-Enter', cmd);
  }

  if (schema.nodes.figure) {
    enterCommands.push((state, dispatch, _view) => {
      const { $head, $anchor } = state.selection;
      if ($head.parent.type.name === nodeNames.figcaption) {
        const figcaption = $head.parent;
        // TODO: exit and create a new paragraph
        const figure = $head.node($head.depth - 1);
        if (figure.type.name !== nodeNames.figure) {
          return false;
        }

        let imageIndex = -1;
        let captionIndex = -1;

        figure.forEach((child, _offset, i) => {
          if (child.type.name === nodeNames.image) {
            imageIndex = i;
          }
          if (child.eq(figcaption)) {
            captionIndex = i;
          }
        });

        if (imageIndex === -1) {
          console.log('no image');
        } else {
          if (captionIndex > -1) {
            if (captionIndex > imageIndex) {
              // const selection = new NodeSelection($head.pos - $head.parentOffset)
              const start = $head.pos - $head.parentOffset;
              console.log(
                `after ${start}`,
                $head,
                figure,
                `compare ${$head.parentOffset} - ${$head.parent.nodeSize}`,
              );
              dispatch?.(state.tr.setSelection(NodeSelection.create(state.doc, start - 1)));
              return true;
            } else {
              console.log('before');
            }
          } else {
            // shouldn't reach here since caption should exsits in the figure
            return false;
          }
        }

        // TODO: handle whether the figurecaption is before or after the node
      }
      return false;
    });
  }

  if (schema.nodes.list_item) {
    // TODO: Could improve this a bunch!!
    enterCommands.push(splitListItem(schema.nodes.list_item));

    bind(
      'Mod-Shift-7',
      chainCommands(liftListItem(schema.nodes.list_item), wrapInList(schema.nodes.ordered_list)),
    );
    bind(
      'Mod-Shift-8',
      chainCommands(liftListItem(schema.nodes.list_item), wrapInList(schema.nodes.bullet_list)),
    );
    const cmdLift = liftListItem(schema.nodes.list_item);
    const cmdSink = sinkListItem(schema.nodes.list_item);
    bind('Shift-Tab', cmdLift);
    bind('Mod-[', cmdLift);
    bind('Tab', cmdSink);
    bind('Mod-]', cmdSink);
  }

  if (schema.nodes.paragraph) bind('Mod-Alt-0', setBlockType(schema.nodes.paragraph));

  if (schema.nodes.heading) {
    for (let i = 1; i <= 6; i += 1) {
      // TODO: this does not preserve the ID
      bind(`Mod-Alt-${i}`, setBlockType(schema.nodes.heading, { level: i, id: createId() }));
    }
  }

  if (schema.nodes.horizontal_rule) {
    const hr = schema.nodes.horizontal_rule;
    bind('Mod-_', (state, dispatch) => {
      if (dispatch === undefined) return false;
      dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
      return true;
    });
  }

  // Confluence and Google Docs comment shortcuts
  bind(
    'Mod-Alt-c',
    (state, dispatch) => dispatch !== undefined && opts.addComment(stateKey, state),
  );
  bind(
    'Mod-Alt-m',
    (state, dispatch) => dispatch !== undefined && opts.addComment(stateKey, state),
  );

  if (enterCommands.length > 0) {
    bind('Enter', chainCommands(...enterCommands));
  }

  return keys;
}

export function captureTab() {
  // Always capture the Tab.
  const capture: KeyMap = () => true;
  const keys = {
    'Shift-Tab': capture,
    Tab: capture,
  };
  return keys;
}
