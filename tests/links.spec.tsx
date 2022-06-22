import React from 'react';
import { render, act, assertElExists, prettyDOM } from './utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { createStore, DemoEditor } from '../demo/init';
import {
  applyProsemirrorTransaction,
  executeCommand,
  selectEditorView,
} from '../src/store/actions';
import { CommandNames } from '../src/store/suggestion/commands';
import { getEditorState, getEditorView } from '../src/store/selectors';
import { Selection, SelectionRange, TextSelection } from 'prosemirror-state';
import { setTextSelection } from 'prosemirror-utils';
import { isEditable } from '../src';

jest.useFakeTimers();
jest.mock('../src/store/suggestion/results/emoji.json', () => ({}));

// TODO: abstract these
const stateKey = 'myEditor';
const viewId1 = 'view1';
const docId = 'docId';
const TARGET_URL = 'testlink.com';
const LINK_TEXT = 'linktext';

describe('links', () => {
  test('should render curvenote link with the correct attributes', () => {
    const { container, getAllByText } = render(
      <DemoEditor content='<a href="https://curvenote.com">curvenote.com</a>"' />,
    );
    const [target] = getAllByText('curvenote.com');
    expect(target).toBeInTheDocument();
    expect(target.getAttribute('href')).toBe('https://curvenote.com');
    expect(target.getAttribute('target')).toBe('_blank');
    expect(target.getAttribute('title')).toBe('https://curvenote.com');
    expect(target.getAttribute('rel')).toBe('noopener noreferrer');
  });

  test('should create link through link command', async () => {
    // TODO: move this to render method?
    window.prompt = jest.fn();

    (window.prompt as jest.Mock).mockReturnValue(TARGET_URL);
    const store = createStore();
    const { container } = render(<DemoEditor content={`<p>${LINK_TEXT}</p>`} store={store} />);
    act(() => {
      store.dispatch(
        applyProsemirrorTransaction(stateKey, viewId1, (tr, view) => {
          const { state } = view;
          const $start = state.tr.doc.resolve(1);
          const $end = state.tr.doc.resolve(1 + LINK_TEXT.length);
          tr.setSelection(new TextSelection($start, $end));
          return tr;
        }),
      );
      store.dispatch(executeCommand(CommandNames.link, viewId1));
    });
    expect(window.prompt).toHaveBeenCalledTimes(1);
    const docEl = container.querySelector('.ProseMirror');
    const target = docEl?.querySelector(`a[href="${TARGET_URL}"]`);
    expect(target).toBeInTheDocument();
    expect(target?.innerHTML).toBe(LINK_TEXT);

    (window.prompt as any) = null;
  });

  test('should have edit link button when link is selected', async () => {
    const store = createStore();
    const { queryByText } = render(
      <DemoEditor content={`<a href="${TARGET_URL}">${LINK_TEXT}</a>`} store={store} />,
    );

    await act(async () => {
      store.dispatch(selectEditorView(viewId1));
      store.dispatch(applyProsemirrorTransaction(stateKey, viewId1, setTextSelection(4)));
      jest.runAllTimers();
    });

    expect(queryByText('Edit Link')).toBeInTheDocument();
  });
  describe('edit link', () => {
    async function selectLink() {
      const store = createStore();
      const result = render(
        <DemoEditor content={`<a href="${TARGET_URL}">${LINK_TEXT}</a>`} store={store} />,
      );

      await act(async () => {
        store.dispatch(selectEditorView(viewId1));
        store.dispatch(applyProsemirrorTransaction(stateKey, viewId1, setTextSelection(4)));
        jest.runAllTimers();
      });
      return result;
    }
    test('should enable edit link when click on edit link button', async () => {
      const { queryByLabelText, queryByRole } = await selectLink();
      const link = queryByLabelText('edit link inline');
      assertElExists(link);
    });

    async function focusOnUrlEdit() {
      const { queryByLabelText, queryByRole, ...rest } = await selectLink();
      const link = queryByLabelText('edit link inline');
      const linkExists = assertElExists(link);
      if (!linkExists) return;

      await act(async () => {
        await userEvent.click(link, { delay: null });
      });

      const tooltip = queryByRole('tooltip');
      const tooltipExists = assertElExists(tooltip);
      if (!tooltipExists) return;

      const input = tooltip.querySelector('input');
      const inputExists = assertElExists(input);
      if (!inputExists) return;

      input.focus();
      return { input, ...rest };
    }
    test('should enable edit random url', async () => {
      const result = await focusOnUrlEdit();
      await userEvent.keyboard('random url hehe{Enter}', { delay: null });
      expect(result?.input).not.toBeInTheDocument();
    });

    test('should update doc based on url change', async () => {
      const result = await focusOnUrlEdit();
      await userEvent.keyboard('random url here{Enter}', { delay: null });

      expect(
        result?.container.querySelector('[href="http://testlink.comrandom url here"]'),
      ).toBeInTheDocument();
    });
  });
});
