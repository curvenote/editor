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
  code_block_yaml,
  code_block_text,
  a,
  link,
  br,
  img,
  abbr,
  subscript,
  superscript,
  math,
  equation,
  equationNumbered,
  callout,
  figureF,
  figureT,
  figureC,
  figcaptionF,
  figcaptionT,
  figcaptionE,
  figcaptionC,
  table,
  table_row,
  table_header,
  table_cell,
} = tnodes;

const same = compare((c) => fromMarkdown(c, 'full'), toMarkdown);

describe('Markdown', () => {
  it('parses a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('parses headings', () =>
    same('# one\n\n## two\n\nthree', tdoc(h1('one'), h2('two'), p('three'))));
  // Add other test cases from here:
  // https://github.com/ProseMirror/prosemirror-markdown/blob/master/test/test-parse.js
  it('parses inline equations', () =>
    same(
      'A line is $y = \\lambda x + b$!',
      tdoc(p('A line is ', math('y = \\lambda x + b'), '!')),
    ));
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
      '```python\nimport numpy as np\nnp.array(5)\n```',
      tdoc(code_block('import numpy as np\nnp.array(5)')),
    ));
  it('Code example - yaml', () =>
    same('```yaml\nhello: []\n```', tdoc(code_block_yaml('hello: []'))));
  it('Code with ticks', () =>
    same('````text\n```{directive}\n```\n````', tdoc(code_block_text('```{directive}\n```'))));
  it('serializes figures with code', () => {
    const f = toMarkdown(
      tdoc(figureC(figcaptionC('This is a code ', em('caption')), code_block_yaml('hello: []'))),
    );
    expect(f).toBe('```yaml\nhello: []\n```');
  });
  it('Directive content (warning)', () =>
    same(
      {
        before: '````{warning}\nThis is *directive* content\n\n````',
        after: '````{warning}\nThis is *directive* content\n\n````',
      },
      tdoc(callout('', p('This is ', em('directive'), ' content'))),
    ));
  it('serializes figures with images', () => {
    const f = toMarkdown(tdoc(figureF(img(), figcaptionF('This is an image ', em('caption')))));
    expect(f).toBe(
      '```{figure} img.png\n:name: my-figure\n:align: center\n:width: 70%\n\nThis is an image *caption*\n```',
    );
  });
  it('serializes figures with tables', () => {
    const f = toMarkdown(
      tdoc(
        figureT(
          figcaptionT('This is a table ', em('caption')),
          table(
            table_row(table_header(p('\nTraining')), table_header(p('\n\n\n\nValidation'))),
            table_row(table_cell(p('0'), p('1')), table_cell(p('5'))),
            table_row(table_cell(p(), p(), p(), p('13720')), table_cell(p('2744'))),
          ),
        ),
      ),
    );
    expect(f).toBe(`~~~{list-table} This is a table *caption*
:header-rows: 1
:name: my-table

* - 
    Training

  - 
    Validation

* - 0

    1

  - 5

* - 13720

  - 2744

~~~`);
  });

  it('serializes equations', () => {
    const f = toMarkdown(tdoc(equationNumbered('Ax = b')));
    expect(f).toBe(`\`\`\`{math}
:label: my-equation

Ax = b
\`\`\``);
  });
  it.skip('parses images', () =>
    same('This is an inline image: ![x](img.png)', tdoc(p('This is an inline image: ', img('')))));
});
