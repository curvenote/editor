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
  Keymap,
} from 'prosemirror-commands';
import { wrapInList, splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { undo, redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { createId } from '@curvenote/schema';
import { store, opts } from '../../connect';
import { focusSelectedEditorView } from '../../store/ui/actions';
import { executeCommand } from '../../store/actions';
import { buildFigureKeymap } from './figure';
import { CommandNames } from '../../store/suggestion/commands';
import { AddKey, createBind, flattenCommandList } from './utils';

const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

function basicMarkCommands(schema: Schema, bind: AddKey): void {
  if (schema.marks.strong) {
    bind('Mod-b', toggleMark(schema.marks.strong));
    bind('Mod-B', toggleMark(schema.marks.strong));
  }
  if (schema.marks.em) {
    bind('Mod-i', toggleMark(schema.marks.em));
    bind('Mod-I', toggleMark(schema.marks.em));
  }
  if (schema.marks.underline) {
    bind('Mod-u', toggleMark(schema.marks.underline));
    bind('Mod-U', toggleMark(schema.marks.underline));
  }
  if (schema.marks.code) bind('Mod-C', toggleMark(schema.marks.code));
  if (schema.marks.link) {
    const addLink = () => {
      const { viewId } = store.getState().editor.ui;
      store.dispatch(executeCommand(CommandNames.link, viewId));
      return true;
    };
    bind('Mod-k', addLink);
    bind('Mod-K', addLink);
  }
}

function addAllCommands(stateKey: any, schema: Schema, bind: AddKey) {
  bind('Mod-z', undoInputRule, undo);
  bind('Mod-Z', redo);
  if (!mac) bind('Mod-y', redo);

  bind('Alt-ArrowUp', joinUp);
  bind('Alt-ArrowDown', joinDown);
  bind('Mod-BracketLeft', lift);
  bind('Escape', undoInputRule);
  bind('Escape', selectParentNode, () => {
    store.dispatch(focusSelectedEditorView(false));
    return true;
  });
  // Immediately select the parent
  bind('Shift-Escape', () => {
    store.dispatch(focusSelectedEditorView(false));
    return true;
  });

  basicMarkCommands(schema, bind);

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

  bind('Backspace', undoInputRule);

  if (schema.nodes.list_item) {
    // TODO: Could improve this a bunch!!
    bind('Enter', splitListItem(schema.nodes.list_item));

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
    bind('Backspace', (state, dispatch) => {
      if (state.selection.empty) {
        return cmdLift(state, dispatch);
      }
      return false;
    });
  }

  buildFigureKeymap(schema, bind);

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
}

export function buildBasicKeymap(schema: Schema): Keymap {
  const { keys, bind } = createBind();
  basicMarkCommands(schema, bind);
  return flattenCommandList(keys);
}

export function buildKeymap(stateKey: any, schema: Schema): Keymap {
  const { keys, bind } = createBind();
  addAllCommands(stateKey, schema, bind);
  return flattenCommandList(keys);
}

export function captureTab(): Keymap {
  // Always capture the Tab.
  const capture: Command = () => true;
  const keys = {
    'Shift-Tab': capture,
    Tab: capture,
  };
  return keys;
}
