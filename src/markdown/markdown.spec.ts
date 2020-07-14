import { nodes, compare } from '../../test/build';
import { fromMarkdown, toMarkdown } from '.';

const {
  doc, blockquote, h1, h2, p, hr, li, ol, ol3, ul, pre, em, strong, code, a, link, br, img,
} = nodes;

const same = compare(fromMarkdown, toMarkdown);

describe('Upgrades', () => {
  it('parses a paragraph', () => same('hello!', doc(p('hello!'))));
  it('parses headings', () => same('# one\n\n## two\n\nthree', doc(h1('one'), h2('two'), p('three'))));
  // Add other test cases from here:
  // https://github.com/ProseMirror/prosemirror-markdown/blob/master/test/test-parse.js
});
