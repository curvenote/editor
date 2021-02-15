import Fuse from 'fuse.js';
import { EditorView } from 'prosemirror-view';
import { Fragment } from 'prosemirror-model';
import { AppThunk } from '../../types';
import { getSuggestion } from '../selectors';
import * as actions from '../../actions/editor';
import { commands, CommandResult, CommandNames } from '../commands';
import { triggerSuggestion } from '../../../prosemirror/plugins/suggestion';
import schema from '../../../prosemirror/schema';
import { getLinkBoundsIfTheyExist } from '../../../prosemirror/utils';
import { getEditorView } from '../../state/selectors';
import {
  getYouTubeId, getMiroId, getLoomId, getVimeoId,
} from './utils';
import { opts } from '../../../connect';

const options = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: [
    {
      name: 'title',
      weight: 0.6,
    },
    {
      name: 'shortcut',
      weight: 0.2,
    },
    {
      name: 'description',
      weight: 0.2,
    },
  ],
};
const fuse = new Fuse(commands, options);

export const startingSuggestions = commands;


export function executeCommand(
  command: CommandNames,
  viewOrId: EditorView | string | null,
  removeText = () => true,
  replace = false,
): AppThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    let view: EditorView;
    if (viewOrId == null) return false;
    if (typeof viewOrId === 'string') {
      const ev = getEditorView(getState(), viewOrId);
      if (ev.view == null) return false;
      view = ev.view;
    } else {
      view = viewOrId;
    }

    const replaceOrInsert = replace ? actions.replaceSelection : actions.insertNode;

    switch (command) {
      case CommandNames.link: {
        removeText();
        const linkBounds = getLinkBoundsIfTheyExist(view.state);
        if (linkBounds) {
          const { from, to } = linkBounds;
          view.dispatch(view.state.tr.removeMark(from, to, schema.marks.link));
          return true;
        }
        // eslint-disable-next-line no-alert
        const href = prompt('Link Url?');
        if (!href) return false;
        const { from, to } = view.state.selection;
        view.dispatch(view.state.tr.addMark(from, to, schema.marks.link.create({ href })));
        return true;
      }
      case CommandNames.callout:
        removeText();
        dispatch(actions.wrapIn(schema.nodes.callout));
        return true;
      case CommandNames.aside:
        removeText();
        dispatch(actions.wrapIn(schema.nodes.aside));
        return true;
      case CommandNames.horizontal_rule:
        removeText();
        dispatch(replaceOrInsert(schema.nodes.horizontal_rule));
        return true;
      case CommandNames.paragraph:
        removeText();
        dispatch(actions.wrapInHeading(0));
        return true;
      case CommandNames.heading1:
      case CommandNames.heading2:
      case CommandNames.heading3:
      case CommandNames.heading4:
      case CommandNames.heading5:
      case CommandNames.heading6:
        removeText();
        dispatch(actions.wrapInHeading(Number.parseInt(command.slice(7), 10)));
        return true;
      case CommandNames.quote:
        removeText();
        dispatch(actions.wrapIn(schema.nodes.blockquote));
        return true;
      case CommandNames.bullet_list:
        removeText();
        dispatch(actions.wrapIn(schema.nodes.bullet_list));
        return true;
      case CommandNames.ordered_list:
        removeText();
        dispatch(actions.wrapIn(schema.nodes.ordered_list));
        return true;
      case CommandNames.emoji:
        removeText();
        triggerSuggestion(view, ':');
        return true;
      case CommandNames.math:
        removeText();
        dispatch(actions.insertNode(schema.nodes.math));
        return true;
      case CommandNames.equation:
        removeText();
        dispatch(replaceOrInsert(schema.nodes.equation));
        return true;
      case CommandNames.code:
        removeText();
        dispatch(replaceOrInsert(schema.nodes.code_block));
        return true;
      case CommandNames.variable:
        removeText();
        dispatch(actions.insertVariable({ name: 'myVar', value: '0', valueFunction: '' }));
        return true;
      case CommandNames.display:
        removeText();
        triggerSuggestion(view, '{{');
        return true;
      case CommandNames.range: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(actions.insertInlineNode(schema.nodes.range, { valueFunction: name, changeFunction: `{${name}: value}` }));
        return true;
      }
      case CommandNames.dynamic: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(actions.insertInlineNode(schema.nodes.dynamic, { valueFunction: name, changeFunction: `{${name}: value}` }));
        return true;
      }
      case CommandNames.switch: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(actions.insertInlineNode(schema.nodes.switch, { valueFunction: name, changeFunction: `{${name}: value}` }));
        return true;
      }
      case CommandNames.button: {
        removeText();
        dispatch(actions.insertInlineNode(schema.nodes.button, { clickFunction: '' }));
        return true;
      }
      case CommandNames.youtube: {
        removeText();
        // eslint-disable-next-line no-alert
        const url = prompt('Link to the YouTube video:');
        if (!url) return true;
        const id = getYouTubeId(url);
        const src = `https://www.youtube-nocookie.com/embed/${id}`;
        dispatch(actions.insertNode(schema.nodes.iframe, { src }));
        return true;
      }
      case CommandNames.loom: {
        removeText();
        // eslint-disable-next-line no-alert
        const url = prompt('Link to the Loom Video:');
        if (!url) return true;
        const id = getLoomId(url);
        const src = `https://www.loom.com/embed/${id}`;
        dispatch(actions.insertNode(schema.nodes.iframe, { src }));
        return true;
      }
      case CommandNames.vimeo: {
        removeText();
        // eslint-disable-next-line no-alert
        const url = prompt('Link to the Vimeo Video:');
        if (!url) return true;
        const id = getVimeoId(url);
        const src = `https://player.vimeo.com/video/${id}`;
        dispatch(actions.insertNode(schema.nodes.iframe, { src }));
        return true;
      }
      case CommandNames.miro: {
        removeText();
        // eslint-disable-next-line no-alert
        const url = prompt('Link to the Miro Board:');
        if (!url) return true;
        const id = getMiroId(url);
        const src = `https://miro.com/app/live-embed/${id}`;
        dispatch(actions.insertNode(schema.nodes.iframe, { src }));
        return true;
      }
      case CommandNames.iframe: {
        removeText();
        // eslint-disable-next-line no-alert
        const src = prompt('Link to the IFrame:');
        if (!src) return true;
        dispatch(actions.insertNode(schema.nodes.iframe, { src }));
        return true;
      }
      case CommandNames.citation: {
        removeText();
        const keys = await opts.citationPrompt();
        if (!keys || keys.length === 0) return true;
        const nodes = keys.map((k) => schema.nodes.cite.create({ key: k }));
        const wrapped = schema.nodes.cite_group.createAndFill({}, Fragment.from(nodes));
        if (!wrapped) return false;
        const tr = view.state.tr.replaceSelectionWith(wrapped).scrollIntoView();
        view.dispatch(tr);
        return true;
      }
      default: return removeText();
    }
  };
}

export function chooseSelection(result: CommandResult): AppThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const { view, range: { from, to } } = getSuggestion(getState());
    if (view == null) return false;
    const removeText = () => {
      const { tr } = view.state;
      tr.insertText('', from, to);
      view.dispatch(tr);
      return true;
    };
    return dispatch(executeCommand(result.name, view, removeText, true));
  };
}

export function filterResults(search: string, callback: (results: CommandResult[]) => void): void {
  // This lets the keystroke go through:
  setTimeout(() => {
    const results = fuse.search(search as string);
    callback(results.map((result) => result.item) as CommandResult[]);
  }, 1);
}
