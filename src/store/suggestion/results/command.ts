import Fuse from 'fuse.js';
import { EditorView } from 'prosemirror-view';
import { Fragment, Schema } from 'prosemirror-model';
import { AppThunk } from '../../types';
import { getSuggestion } from '../selectors';
import * as actions from '../../actions/editor';
import { commands, CommandResult, CommandNames } from '../commands';
import { triggerSuggestion } from '../../../prosemirror/plugins/suggestion';
import { getLinkBoundsIfTheyExist } from '../../actions/utils';
import { getEditorView } from '../../state/selectors';
import { getYouTubeId, getMiroId, getLoomId, getVimeoId } from './utils';
import { opts } from '../../../connect';
import { createId } from '../../../utils';

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

const filterCommands = (schema: Schema, results: CommandResult[]) => {
  const allowedNodes = new Set(Object.keys(schema.nodes));
  const filtered = results.filter((r) => {
    if (r.node == null) return true;
    return allowedNodes.has(r.node);
  });
  return filtered;
};

export const startingSuggestions = (schema: Schema) => filterCommands(schema, commands);

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
    const { schema } = view.state;

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
        dispatch(actions.wrapInHeading(schema, 0));
        return true;
      case CommandNames.heading1:
      case CommandNames.heading2:
      case CommandNames.heading3:
      case CommandNames.heading4:
      case CommandNames.heading5:
      case CommandNames.heading6:
        removeText();
        dispatch(actions.wrapInHeading(schema, Number.parseInt(command.slice(7), 10)));
        return true;
      case CommandNames.quote:
        removeText();
        dispatch(actions.wrapIn(schema.nodes.blockquote));
        return true;
      case CommandNames.time:
        removeText();
        dispatch(
          actions.insertInlineNode(schema.nodes.time, { datetime: new Date() }, undefined, false),
        );
        dispatch(actions.insertText(' '));
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
        dispatch(replaceOrInsert(schema.nodes.equation, { id: createId() }));
        return true;
      case CommandNames.code:
        removeText();
        dispatch(replaceOrInsert(schema.nodes.code_block, { id: createId() }));
        return true;
      case CommandNames.variable:
        removeText();
        dispatch(actions.insertVariable(schema, { name: 'myVar', value: '0', valueFunction: '' }));
        return true;
      case CommandNames.display:
        removeText();
        triggerSuggestion(view, '{{');
        return true;
      case CommandNames.range: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(
          actions.insertInlineNode(schema.nodes.range, {
            valueFunction: name,
            changeFunction: `{${name}: value}`,
          }),
        );
        return true;
      }
      case CommandNames.dynamic: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(
          actions.insertInlineNode(schema.nodes.dynamic, {
            valueFunction: name,
            changeFunction: `{${name}: value}`,
          }),
        );
        return true;
      }
      case CommandNames.switch: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(
          actions.insertInlineNode(schema.nodes.switch, {
            valueFunction: name,
            changeFunction: `{${name}: value}`,
          }),
        );
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
      case CommandNames.link_section:
        removeText();
        triggerSuggestion(view, '[[', 'sec: ');
        return true;
      case CommandNames.link_figure:
        removeText();
        triggerSuggestion(view, '[[', 'fig: ');
        return true;
      case CommandNames.link_equation:
        removeText();
        triggerSuggestion(view, '[[', 'eq: ');
        return true;
      case CommandNames.link_code:
        removeText();
        triggerSuggestion(view, '[[', 'code: ');
        return true;
      case CommandNames.link_article:
        removeText();
        triggerSuggestion(view, '[[', 'article: ');
        return true;
      case CommandNames.link_notebook:
        removeText();
        triggerSuggestion(view, '[[', 'notebook: ');
        return true;
      case CommandNames.citation:
        removeText();
        triggerSuggestion(view, '[[', 'cite: ');
        return true;
      case CommandNames.add_citation: {
        removeText();
        const cites = await opts.citationPrompt();
        if (!cites || cites.length === 0) return true;
        const nodes = cites.map((attrs) => schema.nodes.cite.create({ ...attrs }));
        const wrapped = schema.nodes.cite_group.createAndFill({}, Fragment.from(nodes));
        if (!wrapped) return false;
        const tr = view.state.tr.replaceSelectionWith(wrapped).scrollIntoView();
        view.dispatch(tr);
        return true;
      }
      default:
        return removeText();
    }
  };
}

export function chooseSelection(result: CommandResult): AppThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const {
      view,
      range: { from, to },
    } = getSuggestion(getState());
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

export function filterResults(
  schema: Schema,
  search: string,
  callback: (results: CommandResult[]) => void,
): void {
  // This lets the keystroke go through:
  setTimeout(() => {
    const results = fuse.search(search as string);
    callback(filterCommands(schema, results.map((result) => result.item) as CommandResult[]));
  }, 1);
}
