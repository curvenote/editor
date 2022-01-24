import { stringToLatexText } from './utils';

describe('stringToLatex', () => {
  it('Escape!', () => {
    expect(stringToLatexText('\\')).toBe('{\\textbackslash}');
    expect(stringToLatexText('\\ ')).toBe('{\\textbackslash}~');
  });
  it('Quotes!', () => {
    expect(stringToLatexText('‘quote’')).toBe("`quote'");
    expect(stringToLatexText('“quote”')).toBe("``quote''");
  });
  it('Fractions!', () => {
    expect(stringToLatexText('⅒')).toBe('$\\frac{1}{10}$');
  });
  it('Many things!', () => {
    expect(stringToLatexText('#\\%')).toBe('\\#{\\textbackslash}\\%');
    expect(stringToLatexText('……')).toBe('\\dots\\dots');
  });
});
