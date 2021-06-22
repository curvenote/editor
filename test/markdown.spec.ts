import { compare, tnodes, tdoc } from './build';
import { fromMarkdown, toMarkdown } from '../src';

const {
  blockquote,
  h1,
  h2,
  p,
  hr,
  li,
  ol,
  ol3,
  ul,
  pre,
  em,
  strong,
  code,
  code_block,
  a,
  link,
  br,
  img,
  abbr,
  subscript,
  superscript,
  math,
  equation,
  callout,
} = tnodes;

const same = compare((c) => fromMarkdown(c, 'full'), toMarkdown);

describe('Markdown', () => {
  it('parses a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('parses headings', () =>
    same('# one\n\n## two\n\nthree', tdoc(h1('one'), h2('two'), p('three'))));
  // Add other test cases from here:
  // https://github.com/ProseMirror/prosemirror-markdown/blob/master/test/test-parse.js
  it('parses inline equations', () =>
    same('A line is $y = mx + b$!', tdoc(p('A line is ', math('y = mx + b'), '!'))));
  it('parses equations', () =>
    same('A line is:\n\n$$y = mx + b$$', tdoc(p('A line is:'), equation('y = mx + b'))));
  it('parses amsmath', () =>
    same(
      '\\begin{equation}y = mx + b\\end{equation}',
      tdoc(equation('\\begin{equation}y = mx + b\\end{equation}')),
    ));
  it('parses myst inline equations', () =>
    same(
      // Simplify known math roles to wrapping with dollars
      { before: 'A role {math}`Ax = b` in a paragraph.', after: 'A role $Ax = b$ in a paragraph.' },
      tdoc(p('A role ', math('Ax = b'), ' in a paragraph.')),
    ));
  it('parses myst abbr', () =>
    same(
      'Well {abbr}`CSS (Cascading Style Sheets)` is cool?',
      tdoc(p('Well ', abbr('CSS'), ' is cool?')),
    ));
  it('parses subscript abbr', () => same('H{sub}`2`O', tdoc(p('H', subscript('2'), 'O'))));
  it('parses links', () =>
    same(
      'This is an [example](https://example.com) of a link',
      tdoc(p('This is an ', a('example'), ' of a link')),
    ));
  it('parses auto links', () =>
    same(
      'Example: <https://example.com> is a link',
      tdoc(p('Example: ', a('https://example.com'), ' is a link')),
    ));
  it('simplifies bare links', () =>
    same(
      {
        before: 'This is an [https://example.com](https://example.com) of a link',
        after: 'This is an <https://example.com> of a link',
      },
      tdoc(p('This is an ', a('https://example.com'), ' of a link')),
    ));
  it('Code example', () =>
    same(
      {
        before: '```python\nimport numpy as np\nnp.array(5)\n```',
        // TODO: Capture language
        after: '```\nimport numpy as np\nnp.array(5)\n```',
      },
      tdoc(code_block('import numpy as np\nnp.array(5)')),
    ));
  it('Directive content (warning)', () =>
    same(
      {
        before: '```{warning}\nThis is *directive* content\n```',
        after: '```{warning}\nThis is *directive* content\n```',
      },
      tdoc(callout('', p('This is ', em('directive'), ' content'))),
    ));
  it.skip('parses images', () =>
    same('This is an inline image: ![x](img.png)', tdoc(p('This is an inline image: ', img('')))));
});
