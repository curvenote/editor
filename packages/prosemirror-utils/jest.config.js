module.exports = {
  testMatch: ['**/*.spec.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  globals: {
    'ts-jest': {
      tsconfig: './tests/tsconfig.json',
    },
  },
  setupFilesAfterEnv: ['./jestFrameworkSetup.js'],
};
