import React from 'react';
// import { prettyDOM, render } from '@testing-library/react';
import { render, act, prettyDOM, waitFor } from './utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { createStore, DemoEditor } from '../demo/init';
import { applyProsemirrorTransaction, executeCommand } from '../src/store/actions';
import { CommandNames } from '../src/store/suggestion/commands';
import { getEditorState, getEditorView } from '../src/store/selectors';
import { Selection, SelectionRange, TextSelection } from 'prosemirror-state';
import { setTextSelection } from 'prosemirror-utils';
import { isEditable } from '../src';

// TODO: abstract these
const stateKey = 'myEditor';
const viewId1 = 'view1';
const docId = 'docId';

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

    const TARGET_URL = 'testlink.com';
    const LINK_TEXT = 'linktext';
    (window.prompt as jest.Mock).mockReturnValue(TARGET_URL);
    const store = createStore();
    const { container, getAllByText, findAllByAltText } = render(
      <DemoEditor content={`<p>${LINK_TEXT}</p>`} store={store} />,
    );
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
});
