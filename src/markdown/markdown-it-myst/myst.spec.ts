import MarkdownIt from 'markdown-it';
import { myst_role_plugin } from './myst_role';

const tokenizer = MarkdownIt('commonmark', { html: false });
tokenizer.use(myst_role_plugin);

const sameF = (md: string, html: string) => expect(tokenizer.render(md)).toEqual(`${html}\n`);
const sameI = (md: string, html: string) => expect(tokenizer.renderInline(md)).toEqual(html);

describe('Markdown', () => {
  it('parses a paragraph', () => sameF('hello!', '<p>hello!</p>'));
  it('parses a paragraph', () => sameI('hello!', 'hello!'));
  it('parses myst math', () => sameI(
    'Best matrix equation is {math}`Ax = b`',
    'Best matrix equation is <span class="math">Ax = b</span>',
  ));
  it('parses myst abbr', () => sameI(
    'Well {abbr}`CSS (Cascading Style Sheets)` is cool?',
    'Well <abbr title="Cascading Style Sheets">CSS</abbr> is cool?',
  ));
});
