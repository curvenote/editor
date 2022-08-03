module.exports = {
  testMatch: ['**/*.spec.ts', '**/*.yml'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.yalc/', '/dist/', 'docs'],
  moduleNameMapper: {
    mystjs: '<rootDir>/node_modules/mystjs/dist/index.umd.js',
  },
  globals: {
    'ts-jest': {
      tsconfig: './src/tsconfig.json',
    },
  },
};
