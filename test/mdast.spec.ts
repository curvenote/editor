import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Root } from 'myst-spec';
import { fromJSON, fromMdast, toMdast, toYAML } from '../src';
import { transformNumericalFootnotes } from '../src/serialize/mdast/convertToMdast';

type TestFile = {
  cases: TestCase[];
};
type TestCase = {
  title: string;
  description?: string;
  skip?: boolean | 'm2c' | 'c2m';
  curvenote: Record<string, any>;
  mdast: Root;
};

const directory = 'test/conversions';
const files: string[] = fs.readdirSync(directory).filter((name) => name.endsWith('.yml'));

// For prettier printing of test cases
const length = files.map((f) => f.replace('.yml', '')).reduce((a, b) => Math.max(a, b.length), 0);

const skipped: Record<string, [string, TestCase][]> = {};
const cases: [string, TestCase][] = files
  .map((file) => {
    const testYaml = fs.readFileSync(path.join(directory, file)).toString();
    const caseYaml = yaml.load(testYaml) as TestFile;
    return caseYaml.cases.map((testCase) => {
      const section = `${file.replace('.yml', '')}:`.padEnd(length + 2, ' ');
      const name = `${section} ${testCase.title}`;
      return [name, testCase] as [string, TestCase];
    });
  })
  .flat();

const c2mKey = 'Testing curvenote --> mdast conversions';
describe(c2mKey, () => {
  skipped[c2mKey] = [];
  const unskippedCases: [string, TestCase][] = cases.filter(([f, t]) => {
    const skip = t.skip === true || t.skip === 'c2m';
    if (skip) skipped[c2mKey].push([f, t]);
    return !skip;
  });
  test.each(unskippedCases)('%s', (_, { curvenote, mdast }) => {
    const doc = fromJSON(curvenote, 'full');
    const newMdastString = yaml.dump(transformNumericalFootnotes(toMdast(doc)));
    const mdastString = yaml.dump(mdast);
    expect(newMdastString).toEqual(mdastString);
  });
});

const m2cKey = 'Testing mdast --> curvenote conversions';
describe(m2cKey, () => {
  skipped[m2cKey] = [];
  const unskippedCases: [string, TestCase][] = cases.filter(([f, t]) => {
    const skip = t.skip === true || t.skip === 'm2c';
    if (skip) skipped[m2cKey].push([f, t]);
    return !skip;
  });
  test.each(unskippedCases)('%s', (_, { curvenote, mdast }) => {
    const doc = yaml.dump(curvenote);
    const newDoc = fromMdast(mdast, 'full');
    const newDocString = toYAML(newDoc);
    expect(newDocString).toEqual(doc);
  });
});

[c2mKey, m2cKey].forEach((key) => {
  if (skipped[key].length) {
    describe(`Skipped Tests: ${key}`, () => {
      test.skip.each(skipped[key])('%s', () => null);
    });
  }
});
