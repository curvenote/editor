import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Root } from 'mdast';
import { toMdast } from '../src';

type TestFile = {
  cases: TestCase[];
};
type TestCase = {
  title: string;
  description?: string;
  skip?: boolean;
  curvenote: Record<string, any>;
  mdast: Root;
};

const directory = 'test/conversions';
const files: string[] = fs.readdirSync(directory).filter((name) => name.endsWith('.yml'));

// For prettier printing of test cases
const length = files.map((f) => f.replace('.yml', '')).reduce((a, b) => Math.max(a, b.length), 0);

const skipped: [string, TestCase][] = [];
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
  .flat()
  .filter(([f, t]) => {
    if (t.skip) skipped.push([f, t]);
    return !t.skip;
  });

describe('Testing curvenote --> mdast conversions', () => {
  test.each(cases)('%s', (_, { curvenote, mdast }) => {
    const newMdastString = yaml.dump(toMdast(curvenote));
    const mdastString = yaml.dump(mdast);
    expect(newMdastString).toEqual(mdastString);
  });
});

if (skipped.length) {
  describe('Skipped Tests', () => {
    test.skip.each(skipped)('%s', () => null);
  });
}
