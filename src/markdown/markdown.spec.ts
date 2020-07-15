import { compare, tnodes, tdoc } from '../../test/build';
import { fromMarkdown, toMarkdown } from '.';

const {
  blockquote, h1, h2, p, hr, li, ol, ol3, ul, pre, em, strong, code, a, link, br, img,
} = tnodes;

const same = compare(fromMarkdown, toMarkdown);

describe('Markdown', () => {
  it('parses a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('parses headings', () => same('# one\n\n## two\n\nthree', tdoc(h1('one'), h2('two'), p('three'))));
  // Add other test cases from here:
  // https://github.com/ProseMirror/prosemirror-markdown/blob/master/test/test-parse.js
});
