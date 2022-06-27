import React from 'react';
import { render, act, assertElExists, delay } from './utils';
import userEvent from '@testing-library/user-event';
import { createStore, DemoEditor } from '../../demo/init';
import {
  applyProsemirrorTransaction,
  executeCommand,
  selectEditorView,
} from '../../src/store/actions';
import { CommandNames } from '../../src/store/suggestion/commands';
import { TextSelection } from 'prosemirror-state';
import { setTextSelection } from 'prosemirror-utils';

// TODO: abstract these they are copy pasted from demo since the setup logic is shared
const stateKey = 'myEditor';
const viewId1 = 'view1';
const docId = 'docId';
const TARGET_URL = 'testlink.com';
const LINK_TEXT = 'linktext';

it('should render curvenote link with the correct attributes', () => {
  const { container, getAllByText } = render(
    <DemoEditor content='<a href="https://curvenote.com">curvenote.com</a>"' />,
  );
  const [target] = getAllByText('curvenote.com');
  expect(target).to.be.any;
  expect(target.getAttribute('href')).to.equal('https://curvenote.com');
  expect(target.getAttribute('target')).to.equal('_blank');
  expect(target.getAttribute('title')).to.equal('https://curvenote.com');
  expect(target.getAttribute('rel')).to.equal('noopener noreferrer');
});

it('should create link through link command', async () => {
  cy.stub(window, 'prompt').returns(TARGET_URL);
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
  const docEl = container.querySelector('.ProseMirror');
  const target = docEl?.querySelector(`a[href="http://${TARGET_URL}"]`);
  expect(target?.innerHTML).to.equal(LINK_TEXT);
});

it('should have edit link button when link is selected', async () => {
  const store = createStore();
  const { queryByText } = render(
    <DemoEditor content={`<a href="${TARGET_URL}">${LINK_TEXT}</a>`} store={store} />,
  );

  await act(async () => {
    store.dispatch(selectEditorView(viewId1));
    // TODO: in chromium environment we can directly apply ctrl+K shortcut
    store.dispatch(applyProsemirrorTransaction(stateKey, viewId1, setTextSelection(4)));
    await delay(100); // delay is necessary to wait for debounved popper position logic to take effect
  });

  expect(queryByText('Edit Link')?.innerHTML).to.equal('Edit Link');
});
describe('inline edit', () => {
  async function selectLink(url = TARGET_URL) {
    const store = createStore();
    const result = render(
      <DemoEditor content={`<a href="${url}">${LINK_TEXT}</a>`} store={store} />,
    );

    await act(async () => {
      store.dispatch(selectEditorView(viewId1));
      store.dispatch(applyProsemirrorTransaction(stateKey, viewId1, setTextSelection(4)));
      await delay(100);
    });
    return result;
  }
  it('should enable edit link when click on edit link button', async () => {
    const { queryByLabelText, queryByRole } = await selectLink();
    const link = queryByLabelText('edit link inline');
    assertElExists(link);
  });

  async function focusOnUrlEdit(url?: string) {
    const { queryByLabelText, queryByRole, ...rest } = await selectLink(url);
    const link = queryByLabelText('edit link inline');
    const linkExists = assertElExists(link);
    if (!linkExists) return;

    await act(async () => {
      await userEvent.click(link);
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
  describe('handling random url', () => {
    const RANDOM_URL_INPUT = 'random url hehe';
    it('should show warning if url is invalid', async () => {
      await focusOnUrlEdit();
      await userEvent.keyboard(`${RANDOM_URL_INPUT}`);
      const saveButton = document
        .querySelector('[title="URL may be invalid"]')
        ?.querySelector('button')
        ?.querySelector('svg');
      const exists = assertElExists(saveButton);
      if (!exists) return;
      expect(getComputedStyle(saveButton).color).to.equal('rgb(244, 67, 54)'); // TODO: dig this up from theme colors
    });

    it('should allow submit if input random url', async () => {
      await focusOnUrlEdit();
      await userEvent.keyboard(`${RANDOM_URL_INPUT}{Enter}`);
      cy.get('input').should('not.exist');
    });

    it('should update doc based on url change', async () => {
      const result = await focusOnUrlEdit();
      await userEvent.keyboard('random url here{Enter}');
      assertElExists(result?.container.querySelector('[href="testlink.comrandom url here"]'));
    });

    it('should handle mailto url ', async () => {
      const result = await focusOnUrlEdit('');
      await userEvent.keyboard('mailTo:test@hello.com{Enter}');
      assertElExists(result?.container.querySelector('[href="mailTo:test@hello.com"]'));
    });

    it('should handle file: protocol ', async () => {
      const result = await focusOnUrlEdit('');
      await userEvent.keyboard('file:///users/my/file.md{Enter}');
      assertElExists(result?.container.querySelector('[href="file:///users/my/file.md"]'));
    });
    it('should handle ftp: protocol ', async () => {
      const result = await focusOnUrlEdit('');
      await userEvent.keyboard('ftp://somewhere.com{Enter}');
      assertElExists(result?.container.querySelector('[href="ftp://somewhere.com"]'));
    });
  });
});

describe('generate link while typing', () => {
  async function focusOnDoc() {
    const store = createStore();
    const result = render(<DemoEditor content={`<p></p>`} store={store} />);
    await act(async () => {
      (result.container.querySelector('.ProseMirror') as HTMLDivElement).focus();
      store.dispatch(selectEditorView(viewId1));
      store.dispatch(applyProsemirrorTransaction(stateKey, viewId1, setTextSelection(1)));
    });
    return result;
  }
  async function typeLink(text: string) {
    const result = await focusOnDoc();
    await act(async () => {
      await userEvent.keyboard(`${text} `);
    });
    return result;
  }
  async function shouldGenerateLink(input: string, shouldExits: boolean, href = `http://${input}`) {
    const result = await typeLink(input);
    const anchor = result.container?.querySelector(`a[href="${href}"]`);
    if (shouldExits) {
      if (!assertElExists(anchor)) return;
      expect(anchor.innerHTML).to.equal(input);
    } else {
      expect(anchor).to.be.not.ok;
    }
  }

  it('should pickup .org, .net and .com link', async () => {
    await shouldGenerateLink('test.com', true);
    await shouldGenerateLink('test.org', true);
    await shouldGenerateLink('test.net', true);
  });

  it('should pickup test.xyz', async () => {
    await shouldGenerateLink('test.xyz', true);
  });

  it('should pickup subdomain sub.test.xyz', async () => {
    await shouldGenerateLink('sub.test.xyz', true);
  });

  it('should pickup curve.space', async () => {
    await shouldGenerateLink('curve.space', true);
  });
  it('should not pickup index.md', async () => {
    await shouldGenerateLink('index.md', false);
  });

  it('should pickup text starting with protocol http://test.xyz', async () => {
    await shouldGenerateLink('http://test.xyz', true, 'http://test.xyz');
  });

  it('should pickup text starting with protocol event tho the link seems unacceptable http://test.md', async () => {
    await shouldGenerateLink('http://test.md', true, 'http://test.md');
  });

  it('should pickup email address and prepend mailto: to href', async () => {
    const mailToUrl = 'mailto:someone@somewhere.com';
    await shouldGenerateLink('someone@somewhere.com', true, mailToUrl);
  });

  it('should pickup mailto url', async () => {
    const mailToUrl = 'mailto:someone@somewhere.com';
    await shouldGenerateLink(mailToUrl, true, mailToUrl);
  });
});
