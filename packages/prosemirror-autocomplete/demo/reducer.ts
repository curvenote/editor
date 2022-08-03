import { EditorView } from 'prosemirror-view';
import { ActionKind, AutocompleteAction, FromTo } from '../src';
import { closeAutocomplete } from '../src/actions';

const suggestion = document.querySelector('#suggestion') as HTMLDivElement;
const info = document.querySelector('#info') as HTMLDivElement;

const picker = {
  view: null as EditorView | null,
  open: false,
  current: 0,
  range: null as FromTo | null,
};

const NUM_SUGGESTIONS = suggestion.children.length;

function setInfo(action: AutocompleteAction) {
  info.innerText = `Action: ${action.kind}, Range: ${action.range.from}-${action.range.to}, Filter: ${action.filter}, Trigger: ${action.trigger}, Type: ${action.type?.name}`;
}

function placeSuggestion() {
  suggestion.style.display = picker.open ? 'block' : 'none';
  const rect = document.getElementsByClassName('autocomplete')[0]?.getBoundingClientRect();
  if (!rect) return;
  suggestion.style.top = `${rect.top + rect.height}px`;
  suggestion.style.left = `${rect.left}px`;
  [].forEach.call(suggestion.children, (item: HTMLDivElement, i) => {
    item.classList[i === picker.current ? 'add' : 'remove']('selected');
  });
}

export function reducer(action: AutocompleteAction): boolean {
  picker.view = action.view;
  setInfo(action);
  switch (action.kind) {
    case ActionKind.open:
      picker.current = 0;
      picker.open = true;
      picker.range = action.range;
      placeSuggestion();
      return true;
    case ActionKind.close:
      picker.open = false;
      placeSuggestion();
      return true;
    case ActionKind.up:
      picker.current -= 1;
      picker.current += NUM_SUGGESTIONS; // negative modulus doesn't work
      picker.current %= NUM_SUGGESTIONS;
      placeSuggestion();
      return true;
    case ActionKind.down:
      picker.current += 1;
      picker.current %= NUM_SUGGESTIONS;
      placeSuggestion();
      return true;
    case ActionKind.enter: {
      const tr = action.view.state.tr
        .deleteRange(action.range.from, action.range.to)
        .insertText(`You can define this ${action.type ? `${action.type?.name} ` : ''}action!`);
      action.view.dispatch(tr);
      return true;
    }
    default:
      return false;
  }
}

[].forEach.call(suggestion.children, (item: HTMLDivElement, i) => {
  item.addEventListener('click', () => {
    if (!picker.view) return;
    closeAutocomplete(picker.view);
    picker.open = false;
    placeSuggestion();
    if (!picker.range) return;
    const tr = picker.view.state.tr
      .deleteRange(picker.range.from, picker.range.to)
      .insertText(`Clicked on ${i + 1}`);
    picker.view.dispatch(tr);
    picker.view.focus();
  });
});
