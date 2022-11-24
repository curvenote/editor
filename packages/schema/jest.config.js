const esmLibraries = [
  'hastscript',
  'character-entities-legacy',
  'unified',
  'unist-builder',
  'unist-util-',
  'hast-util-',
  'html-',
  'rehype-',
  'mdast-util-',
  'micromark-',
  'trim-trailing-lines',
  'trim-lines',
  'bail',
  'trough',
  'ccount',
  'character-entities-html4',
  'vfile',
  'property-information',
  'space-separated-tokens',
  'comma-separated-tokens',
  'stringify-entities',
  'web-namespaces',
  'zwitch',
];
module.exports = {
  rootDir: '../../',
  preset: 'ts-jest/presets/js-with-ts',
  testMatch: ['<rootDir>/packages/schema/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testTimeout: 10000,
  moduleNameMapper: {
    '#(.*)': '<rootDir>/node_modules/$1', // https://github.com/chalk/chalk/issues/532
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  verbose: true,
  testEnvironment: 'node',
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${esmLibraries.join('|')}))`],
  testPathIgnorePatterns: ['/node_modules/', '/.yalc/', '/dist/'],
};
