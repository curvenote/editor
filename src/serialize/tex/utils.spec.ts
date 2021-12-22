import { stringToLatex } from './utils';

describe('stringToLatex', () => {
  it('Escape!', () => {
    expect(stringToLatex('\\')).toBe('{\\textbackslash}');
    expect(stringToLatex('\\ ')).toBe('{\\textbackslash}~');
  });
  it('Quotes!', () => {
    expect(stringToLatex('‘quote’')).toBe("`quote'");
    expect(stringToLatex('“quote”')).toBe("``quote''");
  });
  it('Fractions!', () => {
    expect(stringToLatex('⅒')).toBe('$\\frac{1}{10}$');
  });
  it('Many things!', () => {
    expect(stringToLatex('#\\%')).toBe('\\#{\\textbackslash}\\%');
    expect(stringToLatex('……')).toBe('\\dots\\dots');
  });
});
