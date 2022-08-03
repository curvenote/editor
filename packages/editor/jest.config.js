/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    '\\.(css|scss|html)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(lit-element|nanoid|uuid|lit-html|d3-format|d3-drag|d3-dispatch|d3-selection)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jestSetup.js'],
};
