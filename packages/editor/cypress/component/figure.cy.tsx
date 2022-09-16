import React from 'react';
import { render, act, assertElExists, delay } from './utils';
import userEvent from '@testing-library/user-event';
import { createStore, DemoEditor } from '../../demo/NewEditorDemo';
import {
  applyProsemirrorTransaction,
  executeCommand,
  getCurrentEditorState,
  selectEditorView,
} from '../../src/store/actions';
import { CommandNames } from '../../src/store/suggestion/commands';
import { TextSelection } from 'prosemirror-state';
import { setTextSelection } from '@curvenote/prosemirror-utils';
import { getEditorState } from '@curvenote/schema/dist/types/server';
import { selectEditorState } from '../../src/store/selectors';

// TODO: abstract these they are copy pasted from demo since the setup logic is shared
const stateKey = 'myEditor';
const viewId1 = 'view1';

const TABLE_CONTENT = `<table> <tr> <th>Header 1</th> <th>Header 2</th> <th>Header 3</th> </tr> <tr> <td>Data over here</td> <td colspan="2">Multiple columns!</td> </tr> </tr> <td>4</td> <td>5</td> <td>6</td> </tr> </table>`;
const FIGURE_CONTENT = `
<pre language="typescript" linenumbers><code>function sayHello() {
  console.log("Hello editing!");
}</code></pre>
`;
const IMAGE_CONTENT = '<img src="https://curvenote.dev/images/logo.png" align="center" width="70%" />'
const IFRAME_CONTENT = '<iframe src="https://www.loom.com/embed/524085f9c64e4652a12bd81a374d58df" align="center" width="70%" ></iframe>'
function generateFigureSnippet(content: string) {
  const SNIPPET_WITH_TABLE = `
		<div class="block" id="first">
			<figure numbered id="fig1">
			${content}
			<figcaption kind="fig"><p>this is caption!</p></figcaption>
			</figure>
		</div>
	`;
  return SNIPPET_WITH_TABLE;
}
const TABLE_FIGURE_SNIPPET = generateFigureSnippet(TABLE_CONTENT);
const CODEBLOCK_FIGURE_SNIPPET = generateFigureSnippet(TABLE_CONTENT);
const IMAGE_FIGURE_SNIPPET = generateFigureSnippet(IMAGE_CONTENT);
const IFRAME_FIGURE_SNIPPET = generateFigureSnippet(IFRAME_CONTENT);

it('should render curvenote link with the correct attributes', () => {
  const { container, getAllByText } = render(<DemoEditor content={TABLE_FIGURE_SNIPPET} />);
  expect(container.querySelector('table')).to.be.instanceOf(HTMLTableElement);
  expect(container.querySelector('figcaption')?.innerHTML).to.be.eq('this is caption!');
});

[TABLE_FIGURE_SNIPPET, CODEBLOCK_FIGURE_SNIPPET, IMAGE_FIGURE_SNIPPET, IFRAME_FIGURE_SNIPPET].forEach((snippet) => {
  it('should create one new paragraph below the figure if hit enter within figure caption', async () => {
    const store = createStore();
    const { container, getAllByText } = render(
      <DemoEditor content={snippet} store={store} stateKey={stateKey} viewId={viewId1} />,
    );
    const figcaption = container.querySelector('figcaption') as HTMLElement;
    userEvent.click(figcaption);
    await userEvent.keyboard('hello{Enter}{Enter}', { delay: 10 });
    expect(
      container.querySelectorAll('#first > div')[1]?.querySelectorAll(':scope > p').length, // there should be one and only one paragraph gets created;
    ).to.eq(1);
  });
});
