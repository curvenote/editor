import Fuse from 'fuse.js';
import { AppThunk } from '../../types';
import { getSuggestion } from '../selectors';
import * as actions from '../../actions/editor';
import { commands, CommandResult, CommandNames } from '../commands';
import { triggerSuggestion } from '../../../prosemirror/plugins/suggestion';

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

export function chooseSelection(result: CommandResult): AppThunk<boolean> {
  return (dispatch, getState) => {
    const { view, range: { from, to } } = getSuggestion(getState());
    if (view == null) return false;

    const removeText = () => {
      const { tr } = view.state;
      tr.insertText('', from, to);
      view.dispatch(tr);
      return true;
    };

    switch (result.name) {
      case CommandNames.callout:
        removeText();
        dispatch(actions.wrapInCallout());
        return true;
      case CommandNames.aside:
        removeText();
        dispatch(actions.wrapInAside());
        return true;
      case CommandNames.horizontal_rule:
        removeText();
        dispatch(actions.insertHorizontalRule());
        return true;
      case CommandNames.heading1:
      case CommandNames.heading2:
      case CommandNames.heading3:
      case CommandNames.heading4:
      case CommandNames.heading5:
      case CommandNames.heading6:
        removeText();
        dispatch(actions.wrapInHeading(Number.parseInt(result.name.slice(7), 10)));
        return true;
      case CommandNames.bullet_list:
        removeText();
        dispatch(actions.wrapInBulletList());
        return true;
      case CommandNames.ordered_list:
        removeText();
        dispatch(actions.wrapInOrderedList());
        return true;
      case CommandNames.emoji:
        removeText();
        triggerSuggestion(view, ':');
        return true;
      case CommandNames.math:
        removeText();
        dispatch(actions.insertMath());
        return true;
      case CommandNames.variable:
        removeText();
        dispatch(actions.insertVariable());
        return true;
      case CommandNames.display:
        removeText();
        triggerSuggestion(view, '{{');
        return true;
      case CommandNames.range: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(actions.insertRange({ valueFunction: name, changeFunction: `{${name}: value}` }));
        return true;
      }
      case CommandNames.dynamic: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(actions.insertDynamic({ valueFunction: name, changeFunction: `{${name}: value}` }));
        return true;
      }
      case CommandNames.switch: {
        removeText();
        // eslint-disable-next-line no-alert
        const name = prompt('Name of the variable:') ?? 'myVar';
        dispatch(actions.insertSwitch({ valueFunction: name, changeFunction: `{${name}: value}` }));
        return true;
      }
      case CommandNames.button: {
        removeText();
        dispatch(actions.insertButton({ clickFunction: '' }));
        return true;
      }
      default: return removeText();
    }
  };
}

export function filterResults(search: string, callback: (results: CommandResult[]) => void): void {
  // This lets the keystroke go through:
  setTimeout(() => {
    const results = fuse.search(search as string);
    callback(results.map((result) => result.item) as CommandResult[]);
  }, 1);
}
