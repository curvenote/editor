import { compare, tnodes, tdoc } from './build';
import { fromMarkdown, toMarkdown } from '../src/markdown';
import { nodes, marks, Schema } from '../src';

const {
  blockquote, h1, h2, p, hr, li, ol, ol3, ul, pre, em, strong, code, a, link, br, img,
  equation, equationBlock,
} = tnodes;
const schema = new Schema({ nodes, marks });

const same = compare((c) => fromMarkdown(c, schema), toMarkdown);

describe('Markdown', () => {
  it('parses a paragraph', () => same('hello!', tdoc(p('hello!'))));
  it('parses headings', () => same('# one\n\n## two\n\nthree', tdoc(h1('one'), h2('two'), p('three'))));
  // Add other test cases from here:
  // https://github.com/ProseMirror/prosemirror-markdown/blob/master/test/test-parse.js
  it('parses inline equations', () => same('A line is $y = mx + b$!', tdoc(p('A line is ', equation('y = mx + b'), '!'))));
  it('parses equations', () => same('A line is:\n\n$$y = mx + b$$', tdoc(p('A line is:'), equationBlock('y = mx + b'))));
});
